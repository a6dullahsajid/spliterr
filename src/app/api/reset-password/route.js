import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    
    try {
        await user.save();
        return Response.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: error.message }, { status: 500 });
    }
}