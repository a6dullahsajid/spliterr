import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";
import { generateOTP } from "@/lib/otp";
import { sendEmail } from "@/lib/sendEmail";
import User from "@/models/User";

export async function POST(req) {
    try {
        await connectDB();

        const { email, purpose } = await req.json();

        const otp = generateOTP();

        const user = await User.findOne({ email });

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        // delete old OTP if exists
        await Otp.deleteMany({ email, purpose });

        await Otp.create({
            email,
            otp,
            purpose,
            expiresAt: Date.now() + 5 * 60 * 1000,
        });

        await sendEmail(
            email,
            "Spliterr OTP Verification",
            `Your OTP to reset password is ${otp}. Valid for 5 minutes.`
        );

        return Response.json(
            { message: "OTP sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            { message: error.message || "Failed to send OTP" },
            { status: 500 }
        );
    }
}