import User from "../../../../../models/user.model";
import { connectDB } from "../../../../../lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const generateAccessAndRefreshToken = async(userId:any)=>{

   const user =await  User.findById(userId)
   
    const accessToken = await user.getAccessToken();
    const refreshToken = await user.getRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave:false})

    return {accessToken, refreshToken}

}


export async function POST(request: NextRequest){

    try {
        await connectDB();
        
        const { email, password} = await request.json();

        if
        (!email || !password){

            return NextResponse.json(
               { error: "please provide email and pasword"}, {status:400}
                  
            )
        }

        const user = await User.findOne({ email });
       
        console.log("encripted password :",user.password);
        


        if(!user){

            return NextResponse.json(
                {error:"user not found"},{status:404}
            )
        }



        const PasswordValid = await user.isPasswordCorrect(password);

        
        if(!PasswordValid){

            return NextResponse.json(
                {error:"invalid password"},
                {
                  status: 401
                }
            )
        }

        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const response = NextResponse.json(
            {
                success: true,
                data: loggedInUser,
                tokens: {
                    accessToken,  // Short-lived (15-30 mins)
                    refreshToken  // Long-lived (7-30 days)
                },
                message: "User logged in successfully"
            }
        );

        // Set cookies properly using Next.js response cookies
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 60 ,
            path: '/',// 1 day in seconds
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60, // 7 days in seconds
            path: '/',
        });

        return response;
         
        
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}