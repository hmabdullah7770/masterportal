import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
    _id: string;
    [key: string]: any;
}

export async function verifyAuth(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('accessToken')?.value || 
                          request.headers.get('Authorization')?.replace('Bearer ', '');

        if (!accessToken) {
            return {
                success: false,
                error: "Unauthorized - No token provided",
                status: 401
            };
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        ) as DecodedToken;



        return {
            success: true,
            vfuser: decodedToken,
            vfuserId: decodedToken._id
        };

    } catch (error: any) {
        return {
            success: false,
            error: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
            status: 401
        };
    }
}