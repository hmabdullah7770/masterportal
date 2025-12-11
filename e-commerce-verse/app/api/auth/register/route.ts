import { NextRequest,NextResponse } from "next/server";
import User from "../../../../models/user.model";
import {connectDB} from "../../../../lib/dbconnect";
import { stat } from "fs";
import { error } from "console";


export async function POST(request: NextRequest){

  try {
    const {name,email,password,profileImage} = await request.json();

    if(!name || !email || !password || !profileImage){

        return NextResponse.json({
            error: "PLease fill all the fields",
             status: 400,
        })
    }
       
        await connectDB();

        const existinguser = await User.findOne({email})
       
        if(existinguser){
            return NextResponse.json(
                {error: "User already exists"},
                {status:400},
            )
        }

        const createuser = await User.create({
            name,
            email,
            password,
            profileImage

        })



        return NextResponse.json({
            messege: "User registered successfully",
            status: 201,
        })

    
    } catch (error) {
    
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}


//do this on the client side with button press to check api
// const res =fetch("/api/auth/register",{
//     method:"Post",
//     headers:{
//         "Content-Type":"application/json"
//     },
//     body:JSON.stringify({
//         name:"abd viller",
//         email:"abdviller@gmail.com",
//         password:"7",
//         profileImage:"ronaldo17"

//     })  
// }
// )
//  res.json();
