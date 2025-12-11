import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import Otp from "../../../../../models/otp.model";
import User from "../../../../../models/user.model";
import { connectDB } from "../../../../../lib/dbconnect";
import bcrypt from "bcryptjs";
import { rateLimit } from "../../../../../lib/rateLimit";
import logger from "../../../../../lib/logger";

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).required()
});

export async function PATCH(request: NextRequest) {
  try {
    // Rate limiting
    try {
      await rateLimit(request);
    } catch (error) {
      logger.warn("Rate limit exceeded for password reset");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const payload = await request.json();
    const { error, value } = resetPasswordSchema.validate(payload);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, otp, newPassword } = value;
    await connectDB();

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, purpose:'password_reset' });
    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP empty" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    const isExpired = otpRecord.expiresAt < new Date();
    
    if(!isValid){
         return NextResponse.json(
            {error: "Invalid Otp please enter the valid otp"}
            , {status: 401}
        )

    }


    if (isExpired) {
      logger.warn(`Invalid password reset attempt for ${email}`);
      // Cleanup expired/invalid OTP
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: " Expired OTP ..." },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Cleanup OTP
    await Otp.deleteOne({ email, purpose: 'password_reset' });

    logger.info(`Password reset successful for ${email}`);
    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Password reset error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}