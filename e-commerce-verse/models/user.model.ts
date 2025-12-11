import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  name: string;
  email: string;
  _id?: mongoose.Types.ObjectId;
  password: string;
  profileImage: string;
  createdAt?: Date;
  updatedAt?: Date;

  //   edit profile
  //watsapp
  //instagram
  // storelink: string;
  //   watsapplink: string;
  //   Instagramlink:string;
  //   gmaillink:string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },

    //default profile image
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
