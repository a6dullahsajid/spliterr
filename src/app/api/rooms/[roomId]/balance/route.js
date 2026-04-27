import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Room from "@/models/Room";
import User from "@/models/User";
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

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }

        const expenses = await Expense.find({ room: roomId });

        const balances = {};

        expenses.forEach(expense => {

            const share = expense.amount / expense.participants.length;

            expense.participants.forEach(participant => {

                const participantId = participant.toString();
                const payerId = expense.paidBy.toString();

                if (participantId === payerId) return;

                if (!balances[participantId]) {
                    balances[participantId] = {};
                }

                if (!balances[participantId][payerId]) {
                    balances[participantId][payerId] = 0;
                }

                balances[participantId][payerId] += share;

            });

        });

        // Build id -> name map for room members
        const users = await User.find(
            { _id: { $in: room.members } },
            { name: 1 }
        ).lean();

        const nameById = users.reduce((acc, u) => {
            acc[u._id.toString()] = u.name;
            return acc;
        }, {});

        // Convert matrix to an array for easier frontend rendering
        const detailedDebts = [];
        for (const [fromId, toMap] of Object.entries(balances)) {
            for (const [toId, amount] of Object.entries(toMap)) {
                detailedDebts.push({
                    from: { id: fromId, name: nameById[fromId] ?? fromId },
                    to: { id: toId, name: nameById[toId] ?? toId },
                    amount,
                });
            }
        }

        return Response.json({
            message: "Balance calculated",
            balances: detailedDebts,
        });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}