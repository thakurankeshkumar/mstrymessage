import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: `Mystry Message <noreply@${process.env.RESEND_EMAILID}>`,
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: "Verification Email send Sucessfully" }

    } catch (emailError) {
        console.error("Error Sending Verification Email", emailError);
        return { success: false, message: "Failed to Send Verification Email" }
    }
}