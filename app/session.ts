// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  email: string;
};

type SessionFlashData = {
  error: string;
  message: {
    title: string;
    description?: string;
    status: string;
  };
};

const secret = "asfafasfasjfhasf";
if (!secret) {
  throw new Error("No session secret provided");
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "psgh-admin-session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    maxAge: 60 * 60 * 45, // 45 minutes by default
  },
});

// Utility function to set session with appropriate maxAge
export async function setSession(session, user, rememberMe) {
  session.set("email", user.email);
  return commitSession(session, {
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 45, // 30 days for remember me, 45 minutes otherwise
  });
}

export { getSession, commitSession, destroySession };
