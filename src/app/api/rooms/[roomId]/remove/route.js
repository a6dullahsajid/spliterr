import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

export async function POST(req, context) {
    try {
        await connectDB();

        const user = verifyToken(req);
        const body = await req.json();

        const { roomId } = await context.params;
        const { userId } = body;

        if (!roomId) {
            return Response.json(
                { message: "roomId is required" },
                { status: 400 }
            );
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        const requesterId = String(user.userId);
        const targetUserId = String(userId || user.userId);
        const leaderId = String(room.leader);
        const isLeader = requesterId === leaderId;

        if (!isLeader && requesterId !== targetUserId) {
            return Response.json(
                { message: "Only the room leader can remove other members" },
                { status: 403 }
            );
        }

        if (targetUserId === leaderId) {
            return Response.json(
                { message: "Room leader cannot be removed. Delete the room instead." },
                { status: 400 }
            );
        }

        const isMember = room.members.some(
            (memberId) => String(memberId) === targetUserId
        );

        if (!isMember) {
            return Response.json(
                { message: "User is not a member of this room" },
                { status: 404 }
            );
        }

        room.members = room.members.filter(
            (memberId) => String(memberId) !== targetUserId
        );
        await room.save();

        return Response.json({
            message: requesterId === targetUserId
                ? "Left room successfully"
                : "User removed from room successfully",
            room,
        });
    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
