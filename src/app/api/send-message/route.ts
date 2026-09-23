import userModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import { success } from "zod";


export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json()
    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not Accepting Messages"
            }, { status: 403 })
        }

        const newMessage = { content, createdAt: new Date() }
        user.message.push(newMessage as Message)
        await user.save();
        return Response.json({
            success: true,
            message: "Message sent Successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("An Unexpeted Error while Sending Error", error)
        return Response.json({
            success: false,
            message: "An Unexpeted Error while Sending Error"
        }, { status: 500 })
    }
}