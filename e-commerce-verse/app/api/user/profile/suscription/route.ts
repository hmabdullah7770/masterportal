import { NextRequest,NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectDB } from "@/lib/dbconnect";
import { subscribe } from "diagnostics_channel";
import {verifyAuth}  from "@/utils/verifyAuth";
import { error, profile } from "console";



export async function GET(request:NextRequest){

    try {
         const name= request.nextUrl.searchParams

         if(!name){
            return NextResponse.json({error:"user name not found"},{status:404})
         }

         await connectDB()

         const channel = await User.aggregate([{
            $match:{
                name:name
            }
         },{
            $lookup:{
               from:"subscriptions",
               localField:"_id",
               foreignField:"channel",
               as:"subscriber"
            }
         },
         {$lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribeTo"

         }}
        ,
        {$addFields:{
            subscribeCount:{$size:"$subscriber"},
            channelsubscribeToCount:{$size:"$subscribeTo"},
            subbutton:{
                $cond:[{
                  if:{$in:[(await (verifyAuth(request))).vfuserId ,"$subscriber.subscriber"] },
                  then:true,
                  else:false
                }]
            }

        }
            },{$project:{
                 fullName:1,
                 name,
                 email:1,
                 subscribeCount:1,
                 subscribeToCount:1,
                 subbutton:1,
                 profileImage:1,
                 createdAt:1,
                 updatedAt:1,


            }}
        
        ])
       if(!channel?.length){
        return NextResponse.json({error:"channel not found"},{status:404})
       }
        console.log(channel)

        return NextResponse.json({messege:"get channel successfully",channel},{status:200})
    } catch (error) {
        
    }

}
