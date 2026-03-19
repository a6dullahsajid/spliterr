import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

// GET SUMMARY
export async function GET(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId } = await context.params;

        const room = await Room.findById(roomId);

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

        const expenses = await Expense.find({ room: roomId });

        let totalRoomExpense = 0;
        let youPaid = 0; // total amount you physically paid
        let userNet = 0; // net amount you should receive (+) or pay (-) vs others
        let youPay = 0; // total you should pay to others (your share in their expenses)

        expenses.forEach(expense => {
            totalRoomExpense += expense.amount;

            const payerId = expense.paidBy.toString();
            const share = expense.amount / expense.participants.length;

            if (payerId === user.userId) {
                youPaid += expense.amount;
            }

            expense.participants.forEach(participant => {
                const participantId = participant.toString();

                // Skip the payer's own share
                if (participantId === payerId) return;

                // If you are the payer, each other participant owes you `share`
                if (payerId === user.userId) {
                    userNet += share;
                }

                // If someone else paid and you are a participant, you owe them `share`
                if (participantId === user.userId && payerId !== user.userId) {
                    userNet -= share;
                    youPay += share;
                }
            });
        });

        const netBalance = userNet;
        const youGet = Math.max(netBalance, 0);

        return Response.json({
            totalRoomExpense,
            youPaid,
            youOwe: youPay,
            netBalance,
            youGet,
            youPay
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}