import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
    try {
        await connectDB();

        const user = verifyToken(req);

        const rooms = await Room.find({
            members: user.userId
        }).populate("members", "name")
        .populate("leader", "name");
        return Response.json({
            message: "Rooms fetched successfully",
            rooms
        });

    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}