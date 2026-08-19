import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) {
        return false;
      } else if (account.provider === "google") {
        return Boolean(
          profile.email_verified && profile.email === process.env.ALLOWED_EMAIL,
        );
      }
      return true;
    },
  },
});
