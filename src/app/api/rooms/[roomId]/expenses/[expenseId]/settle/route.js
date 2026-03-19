import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

// SETTLE EXPENSE
export async function POST(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId, expenseId } = await context.params;

        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return Response.json(
                { message: "Expense not found" },
                { status: 404 }
            );
        }

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json(
                { message: "Room not found" },
                { status: 404 }
            );
        }

        const isPayer = expense.paidBy.toString() === user.userId;
        const isLeader = room.leader.toString() === user.userId;

        if (!isPayer && !isLeader) {
            return Response.json(
                { message: "Only payer or leader can settle this expense" },
                { status: 403 }
            );
        }

        expense.settled = !expense.settled;

        await expense.save();

        return Response.json({
            message: `Expense marked as ${expense.settled ? "settled" : "unsetted"}`,
            settled: expense.settled
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}