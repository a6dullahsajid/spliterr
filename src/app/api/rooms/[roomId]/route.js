import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req, context) {
    try {
        await connectDB();

        const user = verifyToken(req);

        const { roomId } = await context.params;

        const room = await Room.findById(roomId).populate("members", "name").populate("leader", "name");

        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Room fetched successfully",
            room
        });

    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}