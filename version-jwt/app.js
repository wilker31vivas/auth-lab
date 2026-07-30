import express from "express";
import { routerAuth }from "./routes/auth.js";
import { connection } from "./database/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", routerAuth);

export default app