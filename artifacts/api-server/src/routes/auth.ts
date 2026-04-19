import { Router, type IRouter } from "express";

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { username, password } = req.body as { username?: string; password?: string };

  const validUsername = process.env.ADMIN_USERNAME ?? "admin";
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validPassword) {
    res.status(500).json({ error: "Admin password not configured." });
    return;
  }

  if (username === validUsername && password === validPassword) {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid username or password." });
  }
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/auth/me", (req, res): void => {
  res.json({ isAdmin: req.session.isAdmin === true });
});

export default router;
