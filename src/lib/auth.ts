import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003";
        console.log(`[NextAuth] Authorizing ${credentials.email} against ${apiUrl}/api/auth/login`);

        try {
          const res = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });

          const user = await res.json();

          if (res.ok && user) {
            return user;
          }
          console.error("[NextAuth] Login failed with status", res.status, user);
          return null;
        } catch (error) {
          console.error("[NextAuth] Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any)._id;
        token.status = (user as any).status;
        token.position = (user as any).position;
        const resolvedRole = ((user as any).role || (user as any).duties || 'General').trim() || 'General';
        token.role = resolvedRole;
        token.duties = resolvedRole;
      }
      // Always ensure role is non-empty on every token refresh
      if (!token.role || !(token.role as string).trim()) {
        token.role = 'General';
        token.duties = 'General';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).status = token.status;
        (session.user as any).position = token.position;
        // Always ensure a non-empty role so the sidebar can correctly resolve access.
        // If the stored token role is empty, fall back to 'General'.
        const resolvedRole = ((token.role as string) || (token.duties as string) || 'General').trim() || 'General';
        (session.user as any).role = resolvedRole;
        (session.user as any).duties = resolvedRole;
      }
      return session;
    }
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
