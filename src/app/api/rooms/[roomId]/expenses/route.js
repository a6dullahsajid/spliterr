import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Room from "@/models/Room";
import "@/models/User";
import { verifyToken } from "@/lib/auth";


// ADD EXPENSE
export async function POST(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId } = await context.params;
        console.log("roomId", roomId);

        const body = await req.json();

        const { description, amount, participants } = body;

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        // check membership
        const isMember = room.members.some(
            member => member.toString() === user.userId
        );

        if (!isMember) {
            return Response.json(
                { message: "You are not a member of this room" },
                { status: 403 }
            );
        }

        const expense = await Expense.create({
            room: roomId,
            description,
            amount,
            paidBy: user.userId,
            participants: participants || room.members
        });

        return Response.json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}


// GET EXPENSES
export async function GET(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId } = await context.params;
        console.log("roomId", roomId);
        const room = await Room.findById(roomId);
        console.log("room", room);
        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        const isMember = room.members.some(
            member => member.toString() === user.userId
        );

        if (!isMember) {
            return Response.json(
                { message: "You are not a member of this room" },
                { status: 403 }
            );
        }

        const expenses = await Expense.find({ room: roomId })
            .sort({ createdAt: -1 })
            .populate("paidBy", "name email")
            .populate("participants", "name email");

        return Response.json({
            message: "Expenses fetched successfully",
            expenses
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}