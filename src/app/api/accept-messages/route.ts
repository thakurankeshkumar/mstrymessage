import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";



export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }
    const userId = user._id;
    const { acceptMessage } = await request.json();
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessage }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated sucessfully",
            updatedUser

        }, { status: 200 })
    } catch (error) {
        console.error("Failed to update user status to accept messages", error)
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, { status: 401 })
    }
    const userId = user._id;

    try {
        const foundUser = await userModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to found User"
            }, { status: 404 })
        }


        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.error("Error while checking Message Accepting Status", error)
        return Response.json({
            success: false,
            message: "Error while checking Message Accepting Status"
        }, { status: 401 })
    }


}