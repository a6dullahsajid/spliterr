import connectDB from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(req) {
    await connectDB();

    const { email, otp, purpose } = await req.json();

    const record = await Otp.findOne({ email, otp, purpose });

    if (!record) {
        return Response.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (record.expiresAt < Date.now()) {
        return Response.json({ message: "OTP expired" }, { status: 400 });
    }

    // delete OTP after verification
    await Otp.deleteMany({ email, purpose });

    return Response.json({ message: "OTP verified successfully" }, { status: 200 });
}