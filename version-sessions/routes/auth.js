import { Router } from "express";
export const routerAuth = Router();
import { AuthController } from "../controllers/auth.js";
import { requireAuth } from "../middlewares/requireAuth.js";

routerAuth.post("/register", AuthController.register);
routerAuth.post("/login", AuthController.login);
routerAuth.get("/profile", requireAuth, AuthController.profile);
routerAuth.post("/logout", requireAuth, AuthController.logout);