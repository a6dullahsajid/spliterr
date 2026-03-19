import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

function generateInviteCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req) {
    try {
        await connectDB();

        const user = verifyToken(req);

        const body = await req.json();

        if (!body.name) {
            return Response.json(
                { message: "Room name is required" },
                { status: 400 }
            );
        }
        const inviteCode = generateInviteCode();
        const room = await Room.create({
            name: body.name,
            leader: user.userId,
            members: [user.userId],
            inviteCode
        });

        return Response.json({
            message: "Room created successfully",
            room
        });

    } catch (error) {
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}