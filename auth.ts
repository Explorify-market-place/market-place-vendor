// main next auth config

import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, createUser } from "@/lib/db-helpers";
import { randomUUID } from "crypto";
import { verifyPassword } from "@/lib/password";

const config: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const existingUser = await getUserByEmail(credentials.email as string);

        if (!existingUser) {
          throw new Error("No vendor account found with this email");
        }

        // Only allow vendors to sign in
        if (existingUser.role !== "vendor") {
          throw new Error(
            "This platform is for vendors only. Please use the main Explorify website."
          );
        }

        if (!existingUser.password) {
          throw new Error(
            "This account uses OAuth. Please sign in with Google."
          );
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          existingUser.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: existingUser.userId,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (!user?.email) return false;

      // For OAuth (Google) sign in
      if (account?.provider === "google") {
        const existing = await getUserByEmail(user.email);

        if (!existing) {
          // Auto-create vendor account for new Google users
          console.log("Creating new vendor:", user.email);

          await createUser({
            userId: randomUUID(),
            name: user.name || "",
            email: user.email,
            image: user.image || undefined,
            role: "vendor",
            vendorVerified: false, // Needs admin verification
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else if (existing.role !== "vendor") {
          // Prevent non-vendors from signing in
          return false;
        }
      }

      return true;
    },
    async session({ session, token }: any) {
      if (session.user && token.email) {
        const dbUser = await getUserByEmail(token.email);
        if (dbUser) {
          // Only allow vendors
          if (dbUser.role !== "vendor") {
            return null;
          }
          session.user.id = dbUser.userId;
          session.user.role = dbUser.role;
          session.user.vendorVerified = dbUser.vendorVerified;
        }
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user?.email) token.email = user.email;
      if (token.email) {
        const dbUser = await getUserByEmail(token.email);
        if (dbUser && dbUser.role === "vendor") {
          token.role = dbUser.role;
          token.vendorVerified = dbUser.vendorVerified;
          token.userId = dbUser.userId;
        }
      }
      return token;
    },
  },
  pages: { signIn: "/auth/signin" },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
export { config as authOptions }; // optional: keep for places still calling getServerSession bookings and auth api
