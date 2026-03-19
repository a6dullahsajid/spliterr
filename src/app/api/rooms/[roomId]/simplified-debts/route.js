import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Room from "@/models/Room";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

// GET SIMPLIFIED DEBTS
export async function GET(req, context) {

    try {

        await connectDB();

        const user = verifyToken(req);

        const { roomId } = await context.params;

        const room = await Room.findById(roomId);

        if (!room) {
            return Response.json({ message: "Room not found" }, { status: 404 });
        }

        const expenses = await Expense.find({ room: roomId });

        // Map userId -> name for returning friendly debts
        const users = await User.find(
            { _id: { $in: room.members } },
            { name: 1 }
        ).lean();
        const nameById = users.reduce((acc, u) => {
            acc[u._id.toString()] = u.name;
            return acc;
        }, {});

        const balanceMap = {};

        room.members.forEach(member => {
            balanceMap[member.toString()] = 0;
        });

        expenses.forEach(expense => {

            const share = expense.amount / expense.participants.length;

            expense.participants.forEach(participant => {

                const participantId = participant.toString();
                const payerId = expense.paidBy.toString();

                if (participantId === payerId) return;

                balanceMap[participantId] -= share;
                balanceMap[payerId] += share;

            });

        });

        const creditors = [];
        const debtors = [];

        Object.entries(balanceMap).forEach(([userId, balance]) => {

            if (balance > 0) {
                creditors.push({ userId, balance });
            }

            if (balance < 0) {
                debtors.push({ userId, balance: Math.abs(balance) });
            }

        });

        const transactions = [];

        while (debtors.length && creditors.length) {

            const debtor = debtors[0];
            const creditor = creditors[0];

            const amount = Math.min(debtor.balance, creditor.balance);

            transactions.push({
                from: debtor.userId,
                to: creditor.userId,
                amount
            });

            debtor.balance -= amount;
            creditor.balance -= amount;

            if (debtor.balance === 0) debtors.shift();
            if (creditor.balance === 0) creditors.shift();

        }

        const simplifiedDebts = transactions.map((t) => ({
            fromId: t.from,
            toId: t.to,
            from: nameById[t.from] ?? t.from,
            to: nameById[t.to] ?? t.to,
            amount: t.amount,
        }));

        return Response.json({ simplifiedDebts });

    } catch (error) {

        return Response.json(
            { message: error.message },
            { status: 500 }
        );

    }

}