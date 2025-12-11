import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/dbconnect";
import jwt from "jsonwebtoken"



export async function PATCH(request:NextRequest){
     //   
    //get old and new pasword fro  the user
    //valide the old and new pasword
    //check if the user is logged in
    //match the old password with the password in the database
    //if the password match then update the pasword in the user with new password


    try {

       const verfyuser= request.cookies.get('accessToken')?.value || request.headers.get('Authorization')?.replace('Bearer ','')
          if(!verfyuser){
                return NextResponse.json(
                    {
                        error: "Unauthorized - No token provided"
                    },{
                           status:401
                    }
                )

          }

            const decordetoken =  jwt.verify(verfyuser,process.env.ACCESS_TOKEN_SECRET! ) as { _id: string }

            if(!decordetoken){
                return NextResponse.json(
                    {
                      error:"doecrded token not found"
                    },{
                         status:404
                    }
                )
            }
             const userId = decordetoken._id
                 await connectDB();

                //  const verfiduser = await User.findById(userId)

                //  if(!verfiduser){
                //     return NextResponse.json(
                //         {error:"verified user not found"},{status:404}
                //     )
                //  }
        const {newpassword,oldpassword} = await request.json()
        if(!newpassword || !oldpassword){
            return NextResponse.json(
                {
                    error: "please provide new password and old password"
                },{status:400}
            )
        }   
        // await connectDB();

      const user = await User.findById(userId);
      if(!user){
        return NextResponse.json(
            {error:"User not found"},{status:404}
        )
      }        

      const PasswordValid  = await user.isPasswordCorrect(oldpassword)

      if(!PasswordValid){
        return NextResponse.json(
            {error:"password is not correct"},
            {status:401}

        
        )
      }
         user.password = newpassword
         await user.save({validateBeforeSave:false})

         
         return NextResponse.json(
            {
                messege:"password updated successfully"
            },
            {status:200}
         )

         

         } 
    catch (error) {
        
        return NextResponse.json(
            {
                error: "Internal server error"
            },{
                status:500
            }
        )
    }
}
