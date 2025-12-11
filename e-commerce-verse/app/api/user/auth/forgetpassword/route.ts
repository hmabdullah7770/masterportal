import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import Otp from "../../../../../models/otp.model";
import User from "../../../../../models/user.model";
import { connectDB } from "../../../../../lib/dbconnect";
import bcrypt from "bcryptjs";
import { rateLimit } from "../../../../../lib/rateLimit";
import logger from "../../../../../lib/logger";
import transporter from "../../../../../lib/nodemailer"; // Use your existing transporter

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    try {
      await rateLimit(request);
    } catch (error) {
      logger.warn("Rate limit exceeded for password reset request");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const payload = await request.json();
    const { error, value } = forgetPasswordSchema.validate(payload);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const { email } = value;
    // await connectDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 5 minutes

    // Store OTP with password_reset purpose
    await Otp.create({
      email,
      otp: otpHash,
      expiresAt,
      purpose: 'password_reset'
    });

    // Send email using nodemailer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is ${otp}. It will expire in 20 minutes.`,
        html: `
          <div>
            <h3>Password Reset Request</h3>
            <p>Your OTP code is: <strong>${otp}</strong></p>
            <p>This code will expire in 5 minutes.</p>
          </div>
        `
      });
    } catch (error) {
      logger.error("Failed to send password reset email", error);
      // Clean up OTP if email fails
      await Otp.deleteOne({ email, purpose: 'password_reset' });
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      );
    }

    logger.info(`Password reset OTP sent to ${email}`);
    return NextResponse.json(
      { message: "OTP sent to your email" },
      { status: 200 }
    );
  } catch (error: any) {
    logger.error("Password reset request error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}