import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";



const usernameQueryParams = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const QueryParam = {
            username: searchParams.get("username")
        }

        //Validate with zod
        const result = usernameQueryParams.safeParse(QueryParam);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({ success: false, message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters" }, { status: 400 })
        }

        const { username } = result.data;
        const existingVerifiedUser = await userModel.findOne({ username, isverified: true })
        if (existingVerifiedUser) {
            return Response.json({ success: false, message: "Username is already taken" }, { status: 400 })
        }
        return Response.json({ success: true, message: "Username is unique" }, { status: 200 })

    } catch (error) {
        console.error("Error Checking Username: ", error);
        return Response.json({ success: false, message: "Error Checking Username" }, { status: 500 })
    }
}