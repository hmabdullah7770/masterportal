import User from "@/models/user.model";
import { NextRequest,NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { verifyAuth } from "@/utils/verifyAuth";
import { connectDB } from "@/lib/dbconnect";

export async function GET(request:NextRequest){

    try {
        const getverifyuser = request.cookies.get('accessToken')?.value || request.headers.get('Authorization')?.replace('Bearer ','')
        if(!getverifyuser){
            return NextResponse.json(
                {error: "Unauthroized doesnot get verified user"},{status:401}
            )
        }
        const decodedtoken = jwt.verify(getverifyuser,process.env.ACCESS_TOKEN_SECRET!) as {_id:string}
    
        if(!decodedtoken){
            return NextResponse.json(
                {error:"decorded token not find"},{status:404}
            )
        }
        await connectDB();

      const usertok = User.findById(decodedtoken._id).select('-password -refreshToken')

      if(!usertok){
            return NextResponse.json(
                {error:"user with decorded token not found"},{status:404}
            )
      }
       
      return NextResponse.json({usertok,messege:`get user successfully ${usertok}`}, { status: 200} );

    } catch (error) {

        NextResponse.json(
            {error:"somthing went wrong"},
            {status:500}
        )
        
    }

}