import connectDB from "@/lib/mongodb";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const user = verifyToken(req);

    const body = await req.json();

    const { inviteCode } = body;

    const room = await Room.findOne({ inviteCode });
    console.log("room data",room);

    if (!room) {
      return Response.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }
    const isMember = room.members.some(member => member.toString() === user.userId);
    if (isMember) {
      return Response.json(
        {
          message: "Already a member",
          room
        },
        { status: 200 }
      );
    }

    room.members.push(user.userId);

    await room.save();

    return Response.json({
      message: "Joined room successfully",
      room
    });

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}