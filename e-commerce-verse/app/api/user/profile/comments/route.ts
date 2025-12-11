import { NextRequest,NextResponse } from "next/server";
import { verifyAuth } from "@/utils/verifyAuth";
import User from "@/models/user.model";

export async function POST(request:NextRequest) {

    const name= request.nextUrl.searchParams

    if(!name){
        return NextResponse.json({error:"user name not found"},{status:404})
     }

   

  const comments = User.aggregate(

 [
   {
    $match:{
        
    }

   }  
   
])

}