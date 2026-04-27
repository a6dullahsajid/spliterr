import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import Expense from "@/models/Expense";
import "@/models/User";
import { verifyToken } from "@/lib/auth";


export async function GET(req, context) {
    try {
        await connectDB();

        const user = verifyToken(req);
        if (!user) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

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

export async function DELETE(req, context) {
    try {
        await connectDB();

        const user = verifyToken(req);

        if (!user) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { roomId } = await context.params;
        console.log("Found room with id:", roomId);

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        if (room.leader.toString() !== user.userId) {
            return Response.json(
                { message: "Only the room leader can delete this room" },
                { status: 403 }
            );
        }

        await Expense.deleteMany({ room: roomId });

        await Room.findByIdAndDelete(roomId);

        return Response.json({
            message: "Room and its expenses deleted successfully",
        });

    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}