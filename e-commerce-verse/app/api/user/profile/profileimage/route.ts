import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/user.model";
import { connectDB } from "../../../../../lib/dbconnect";
import { verifyAuth } from "@/utils/verifyAuth";

// Add this interface at the top of the file
interface CloudinaryResponse {
  secure_url: string;
}

// Helper: Convert an ArrayBuffer to a base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Add this function to delete an image from Cloudinary
async function deleteImageFromCloudinary(imageUrl: string) {
  try {
    // Extract the public_id from the Cloudinary URL
    const urlParts = imageUrl.split("/");
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicId = `profile-images/${filenameWithExtension.split(".")[0]}`;

    return new Promise<boolean>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Error deleting image from Cloudinary:", error);
          resolve(false);
        } else {
          console.log("Image deleted from Cloudinary:", result);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.error("Error in deleteImageFromCloudinary:", error);
    return false;
  }
}

export const config = {
  api: { bodyParser: false },
};

export async function POST(request: NextRequest) {
  try {
    // Configure Cloudinary with credentials
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Parse form data using Next's built-in formData() method
    // const formData = await request.formData();
    // const email = formData.get('email') as string;
    // const file = formData.get('file') as File;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Validate inputs

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the file (a Blob) to a base64 data URI
    const arrayBuffer = await file.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);
    const dataUri = `data:${file.type};base64,${base64String}`;

    // Connect to the database and find the user's profile by email
    await connectDB();
    console.log("Searching for user with:", (await verifyAuth(request)).vfuser);

    // First, find the user to get their current profile image
    const userData = await User.findById((await verifyAuth(request)).vfuserId);

    // Upload directly using cloudinary's upload method instead of REST API
    const cloudResult = await new Promise<CloudinaryResponse>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          dataUri,
          {
            folder: "profile-images", // Optional: organize images in a folder
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResponse);
          }
        );
      }
    );

    if (!cloudResult.secure_url) {
      return NextResponse.json(
        { error: "cloud not find the image on cloudinary" },
        { status: 404 }
      );
    }

    // If user had a previous profile image, delete it from Cloudinary
    if (userData && userData.profileImage) {
      await deleteImageFromCloudinary(userData.profileImage);
    }

    // Update the user with the new profile image URL
    const user = await User.findByIdAndUpdate(
      (
        await verifyAuth(request)
      ).vfuserId,
      {
        $set: { profileImage: cloudResult.secure_url },
      },
      {
        new: true,
      }
    );

    console.log("verified User found:", user);
    if (!user) {
      return NextResponse.json(
        { error: "verified User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
        message: "image uploaded successfully",
        image: cloudResult.secure_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
