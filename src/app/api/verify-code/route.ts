import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const user = await userModel.findOne({ username, isVerified: false });

        if (!user) {
            return Response.json({ success: false, message: "User doesn't Exits" }, { status: 404 })
        }

        if (user.isVerified) {
            return Response.json({
                success: false,
                message: "User already Verified"
            },
                {
                    status: 400
                }
            )
        }



        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()
            return Response.json({ success: true, message: "User sucessfully Verified" }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({ success: false, message: "Verification Code has expired please signup Again." }, { status: 400 })
        } else {
            return Response.json({ success: false, message: "Invalid Verification code. Please Try Again." }, { status: 400 })
        }
    } catch (error) {
        console.error("Error while Verifying user: ", error)
        return Response.json({ success: false, message: "Error while Verifying user" }, { status: 500 })
    }

}