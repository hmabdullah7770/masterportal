import User from "@/models/user.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";


interface JwtPayloadWithId extends jwt.JwtPayload {
    _id: string;
}
const generateAccessAndRefreshToken = async (userId: string) => {
    try {
      
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const accessToken = await user.getAccessToken();
        const refreshToken = await user.getRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error while generating tokens");
    }
};

export async function POST(request: NextRequest) {
    try {
      await connectDB ();
        const incommingrefreshToken = request.cookies.get('refreshToken')?.value || 
                           request.headers.get('Authorization')?.replace('Bearer ','');

        if (!incommingrefreshToken) {
            return NextResponse.json(
                { error: "Unauthorized - refresh token is missing" },
                { status: 401 }
            );
        }

        // Verify the refresh token
        const decodedToken = jwt.verify(incommingrefreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayloadWithId;
        
        if (!decodedToken?._id) {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            );
        }

        // Find user and verify refresh token
        const user = await User.findById(decodedToken?._id);
         if(!user){

             return NextResponse.json(  {error:"user with decorded token"},
               { status: 404}          
         )}

         console.log('Incoming Token:', incommingrefreshToken);
console.log('Stored Token:', user.refreshToken);
        if (user.refreshToken !== incommingrefreshToken) {
            return NextResponse.json(
                { error: "Invalid refresh token or user not found" },
                { status: 401 }
            );
        }

        // Generate new tokens
        const { accessToken , refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                data: {
                    _id: user._id,
                    email: user.email,
                    username: user.username
                },
                tokens: {
                    accessToken,
                    NewrefreshToken: newRefreshToken
                },
                message: "Tokens refreshed successfully"
            }
        );

        // Set cookies
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes
            path: '/'
        });

        response.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/'
        });

        return response;

    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


// import User from "@/models/user.model";
// import { error } from "console";
// import jwt from "jsonwebtoken"

// import { NextRequest,NextResponse } from "next/server";



// const generateAccessAndRefreshToken = async(userId:any)=>{

//     const user =await  User.findById(userId)
    
//      const accessToken = await user.getAccessToken();
//      const refreshToken = await user.getRefreshToken();
//      user.refreshToken = refreshToken;
//      await user.save({ validateBeforeSave:false})
 
//      return {accessToken, refreshToken}
 
//  }
 
 

// export async function POST(request:NextRequest){

//     const refreshtoken = request.cookies.get('refreshToken')?.value || 
//                        request.headers.get('Authorization')?.replace('Bearer ',"");

     
//           if(!refreshtoken){

//             return NextResponse.json(
//                 {error:"Unautherized refreshtoken is expired "},
//                 {status:401}
//             )
//           }             


//             const decorderefresh=jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET!,)
           

     
//         const user= await User.findById(decorderefresh?._id)


//           if(user.refreshToken !== refreshtoken){

//             return NextResponse.json(
//                 {error: "Refreshtoken not match with user refreshtoken in db"},
//                 {status:401}
//             )
//           }
            
//           const{accessToken,refreshToken}= generateAccessAndRefreshToken(user._id)


//           const response = NextResponse.json(
//             {
//                 success: true,
//                 data: loggedInUser,
//                 tokens: {
//                     accessToken,  // Short-lived (15-30 mins)
//                     refreshToken  // Long-lived (7-30 days)
//                 },
//                 message: "User logged in successfully"
//             }
//         );


          

//           request.cookies.set('accessToken',accessToken,httpOnly:true,secure:true,sameSite:'strict',maxAge:15*60,path:'/')
//           request.cookies.set('refreshToken',refreshToken,httpOnly:true,secure:true,sameSite:'strict',maxAge:30*24*60*60 ,path:'/')

          

//         }