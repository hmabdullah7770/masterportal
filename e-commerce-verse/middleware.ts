// // middleware.ts

import { NextResponse, NextRequest } from 'next/server';

// Basic middleware for future use if needed
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Define routes that need middleware (empty for now)
export const config = {
  matcher: []
};









// import { request } from 'http';
// import { NextResponse, NextRequest } from 'next/server';

// import { access } from 'fs';
// // import User from '@/models/user.model';
// import next from 'next';
// import jwt from 'jsonwebtoken';
// import { connectDB } from '@/lib/dbconnect'
// // import { connectDB } from '@/lib/db'; 


// // Add type declaration for extended Request interface
// declare module 'next/server' {
//   interface NextRequest {
//     usertok?: any; // Use proper type instead of 'any' if available
//   }
// }

// // varifyjwt middleware 
// export async function middleware(request: NextRequest, response: NextResponse ) {
//   // Common JWT verification logic
//   try {
//      await connectDB();
    
//     // Get token from cookies or Authorization header
//     const token = request.cookies.get('accessToken')?.value || 
//                        request.headers.get('Authorization')?.replace('Bearer ',"");

//     if (! token) {
//       return NextResponse.json(
//         { error: "Unauthorized - No token provided" },
//         { status: 401 }
//       );
//     }

//     // Verify token
//     const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { _id: string };
//      // Instead of importing User model directly, use dynamic import
//      const { default: User } = await import('@/models/user.model');
    
//     const user = await User.findById(decoded._id).select('-password -refreshToken');

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     const response = NextResponse.next();
//     request.usertok = user;
//     return response;
    
//     // Attach user to request
//     // const response = NextResponse.next();
//     // response.cookies.set('user', JSON.stringify(user));
//     // return response;

//   } catch (error) {
//     return NextResponse.json(
//       { error: "Unauthorized - Invalid token" },
//       { status: 401 }
//     );
//   }
// }

// // Apply to protected routes
// export const config = {
//   matcher: [
//     '/api/profile/profileimage',
//     '/api/auth/logout'
//   ],
// };

// //logout middeware and verfiy jwt middleware

// // export function logoutmiddleware(request:NextRequest){

  