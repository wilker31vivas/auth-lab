import express from "express";
import { routerAuth }from "./routes/auth.js";
import { connection } from "./database/db.js";
import cors from 'cors'

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions))
app.use(express.json());

app.use("/api/auth", routerAuth);

export default app