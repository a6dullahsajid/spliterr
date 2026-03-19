import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

// DELETE EXPENSE

export async function DELETE(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId, expenseId } = await context.params;

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json({ message: "Room not found" }, { status: 404 });
        }

        if (room.leader.toString() !== user.userId) {
            return Response.json(
                { message: "Only leader can delete expense" },
                { status: 403 }
            );
        }

        await Expense.findByIdAndDelete(expenseId);

        return Response.json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}

// UPDATE EXPENSE
export async function PATCH(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId, expenseId } = await context.params;

        const body = await req.json();

        const { description, amount } = body;

        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return Response.json({ message: "Expense not found" }, { status: 404 });
        }

        const room = await Room.findById(roomId);
        const isLeader = room?.leader?.toString() === user.userId;

        if (expense.paidBy.toString() !== user.userId && !isLeader) {
            return Response.json(
                { message: "Only payer or leader can edit expense" },
                { status: 403 }
            );
        }

        expense.description = description || expense.description;
        expense.amount = amount || expense.amount;

        await expense.save();

        return Response.json({
            message: "Expense updated",
            expense
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}