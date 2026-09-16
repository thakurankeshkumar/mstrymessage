import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await userModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is alreafy taken"
            }, { status: 400 })
        }

        const exitingUserByEmail = await userModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (exitingUserByEmail) {

            if (exitingUserByEmail.isVerified) {
                return Response.json({ success: false, message: "User already exits with this email" }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                exitingUserByEmail.password = hashedPassword;
                exitingUserByEmail.verifyCode = verifyCode;
                exitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await exitingUserByEmail.save();
            }


        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        // send verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
        }
        return Response.json({ success: true, message: "User Register sucessfully. Please verify your Email" }, { status: 201 });
    } catch (error) {
        console.error("Failed to signup", error);
        return Response.json({ success: false, message: "Failed to signup" }, { status: 500 });
    }
}