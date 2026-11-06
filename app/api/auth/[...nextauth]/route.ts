

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcryptjs";
// import connectToDatabase from "@/lib/db";
// import User from "@/models/User";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         await connectToDatabase();
//         const user = await User.findOne({ email: credentials?.email });
        
//         if (!user) throw new Error("No user found with this email");
//         if (!user.password) throw new Error("Please log in with Google");

//         const isValid = await bcrypt.compare(credentials!.password, user.password);
//         if (!isValid) throw new Error("Incorrect password");

//         return { id: user._id.toString(), name: user.name, email: user.email };
//       }
//     })
//   ],
//  // ... (Providers remain the same)

// callbacks: {
//   async signIn({ user, account }) {
//     if (account?.provider === "google") {
//       try {
//         await connectToDatabase();
//         const existingUser = await User.findOne({ email: user.email });
        
//         if (existingUser && existingUser.name) {
//           user.name = existingUser.name;
//         }

//         if (!existingUser) {
//           await User.create({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//           });
//         }
//         return true;
//       } catch (error) {
//         console.error("Error in Google signIn callback:", error);
//         return false;
//       }
//     }
//     return true;
//   },

//   async jwt({ token, user, account, trigger, session }) {
//     // 1. Initial Sign In
//     if (user) {
//       token.id = user.id;
//       token.name = user.name;
//     }

//     // 2. Handle Session Updates (Crucial for Name Editing)
//     if (trigger === "update" && session?.name) {
//       token.name = session.name;
//     }

//     // 3. Ensure MongoDB ID for Google Users
//     if (account?.provider === "google") {
//       await connectToDatabase();
//       const dbUser = await User.findOne({ email: token.email });
//       if (dbUser) {
//         token.id = dbUser._id.toString();
//         // Always take the name from DB for Google users to prevent sync issues
//         token.name = dbUser.name;
//       }
//     }
//     return token;
//   },

//   async session({ session, token }) {
//     if (session.user) {
//       (session.user as any).id = token.id;
//       session.user.name = token.name; // Keep name in sync with token
//     }
   
//     return session;
//   }
// },

//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 2 * 60 * 60,   
//   updateAge: 60 * 60,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };




import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" } 
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials?.email });
        
        if (!user) throw new Error("No user found with this email");
        if (!user.password) throw new Error("Please log in with Google");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Incorrect password");

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email,
          rememberMe: credentials?.rememberMe === "true" 
        };
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectToDatabase();
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser && existingUser.name) {
            user.name = existingUser.name;
          }

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
          return true;
        } catch (error) {
          console.error("Error in Google signIn callback:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
    const now = Math.floor(Date.now() / 1000);
  const THIRTY_DAYS = 30 * 24 * 60 * 60;
  const TWO_HOURS = 2 * 60 * 60;

      // 1. Initial Sign In
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.rememberMe = (user as any).rememberMe;
        
        // This sets the internal expiration of the token
        token.exp = now + (token.rememberMe ? THIRTY_DAYS : TWO_HOURS);
      }

      // 2. Handle Session Updates
      if (trigger === "update") {
        if (session?.name) token.name = session.name;
        if (session?.rememberMe !== undefined) {
          token.rememberMe = session.rememberMe;
          token.exp = now + (token.rememberMe ? THIRTY_DAYS : TWO_HOURS);
        }
      }

      // 3. Google User ID Sync
      if (account?.provider === "google") {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        (session as any).expires = new Date((token as any).exp * 1000).toISOString();

      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    // IMPORTANT: Remove the hardcoded 30 days. 
    // By not defining a huge maxAge here, NextAuth will defer to the token.exp 
    // we manually calculated in the jwt callback.
     
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };