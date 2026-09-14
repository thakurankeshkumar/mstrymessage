import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        return Response.json({ success: true, message: "User sucessfully Signup" }, { status: 201 });
    } catch (error) {
        console.error("Failed to signup", error);
        return Response.json({ success: false, message: "Failed to signup" }, { status: 500 });
    }
}