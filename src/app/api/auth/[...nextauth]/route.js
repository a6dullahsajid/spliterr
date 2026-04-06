import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "google") return true;

            await connectDB();
            const existing = await User.findOne({ email: user.email });

            if (!existing) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    googleId: account.providerAccountId,
                    password: null,
                });
            } else if (!existing.googleId) {
                existing.googleId = account.providerAccountId;
                await existing.save();
            }

            return true;
        },

        async jwt({ token, account }) {
            if (account?.provider === "google") {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email });

                token.customJwt = jwt.sign(
                    { userId: dbUser._id, email: dbUser.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
                token.userId = dbUser._id.toString();
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id = token.userId;
            session.customJwt = token.customJwt;
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };