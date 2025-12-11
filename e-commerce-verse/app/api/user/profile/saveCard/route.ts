import { NextRequest,NextResponse } from "next/server";
import User from "@/models/user.model";
import { verifyAuth } from "@/utils/verifyAuth";
import mongoose from "mongoose";


export async function GET(request:NextRequest) {

    const savecard = await User.aggregate([

        {$match:{
            _id: new mongoose.Types.ObjectId((await verifyAuth(request)).vfuserId)
        }},
        {
          $lookup:{
            from:"videos",
            localField:"saveCard",
            foreignField:"_id",
            as:"saveCard",
            pipeline:[
                {
                    $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"owner",
                    pipeline:[{
                        $project:{
                        fullName:1,
                        name:1,
                        profileImage:1
                        }
                    }]
                }}
            ]

          }  
        }
        // ,{
        //     $addFields:{
              
                
        //     }
        // }
    ])
    

    if(!savecard){

        return NextResponse.json({error:"save card not found"},{status:404})

    }

    return NextResponse.json({messege:"successfully get the saveCard of the user with Owner",savecard},{status:200})



}