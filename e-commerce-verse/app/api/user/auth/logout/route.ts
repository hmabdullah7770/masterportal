// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import { verifyAuth } from "@/utils/verifyAuth";

export async function POST(request: NextRequest) {
    // try {
    //     // Get token from cookies or Authorization header
    //     const accesstoken = request.cookies.get('accessToken')?.value || 
    //                   request.headers.get('Authorization')?.replace('Bearer ', '');

    //     if (!accesstoken) {
    //         return NextResponse.json(
    //             { error: "Unauthorized - No token provided" },
    //             { status: 401 }
    //         );
    //     }

    //     // // Verify token
    //     // const secret = process.env.ACCESS_TOKEN_SECRET;
    //     // if (!secret) {
    //     //     console.error("ACCESS_TOKEN_SECRET is not defined");
    //     //     return NextResponse.json(
    //     //         { error: "Server configuration error" },
    //     //         { status: 500 }
    //     //     );
    //     // }

    //     try {
    //         // Verify the token and extract user ID
    //         const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET!) as { _id: string };
    //         const userId = decoded._id;
      
     try{
        verifyAuth(request);
try{
            // Connect to database
            await connectDB();
            
            // Dynamic import User model
            const { default: User } = await import('@/models/user.model');
            
            // Find the user and clear refresh token
            const user = await User.findByIdAndUpdate(
                 (await verifyAuth(request)).vfuserId,
                {
                    $set: {
                        refreshToken: undefined
                    }
                },
                {
                    new: true
                }
            );

            if (!user) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            // Create successful response
            const response = NextResponse.json(
                { message: "User logged out successfully" },
                { status: 200 }
            );

            // Clear cookies
            response.cookies.delete('accessToken');
            response.cookies.delete('refreshToken');

            return response;
            
        } catch (jwtError:any) {
            console.error("JWT verification error:", jwtError);
            
            if (jwtError.name === 'TokenExpiredError') {
                return NextResponse.json(
                    { error: "Token expired" },
                    { status: 401 }
                );
            } else {
                return NextResponse.json(
                    { error: "Invalid token" },
                    { status: 401 }
                );
            }
        }
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "An error occurred during logout" },
            { status: 500 }
        );
    }
}





// import { NextRequest, NextResponse } from "next/server";
// import User from "../../../../models/user.model";
// import { access } from "fs";

// export async function POST(request: NextRequest) {
//     //we can also user findbyid but it required aditional steps
//     //like findbyid
//     //delete refresh token
//     //save the user with validate before save false

//     await User.findByIdAndUpdate(request.usertok?._id
//         , {$set: {
//             refreshToken: undefined   //delete the refresh token
//         }},
//         {
//             new: true               //return the new response with deleted refresh token
//         }
//     )

//     // Create response first
//     const response = NextResponse.json(
//         { message: "User logged out successfully" },
//         { status: 200 }
//     );

//     // Clear cookies properly
//     response.cookies.delete('accessToken');
//     response.cookies.delete('refreshToken');

//     return response;
// }
