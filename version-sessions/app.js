import express from "express";
import session from "express-session";
import { routerAuth }from "./routes/auth.js";
import MySQLStoreFactory from "express-mysql-session";
import { connection } from "./database/db.js";
import cors from 'cors'

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({}, connection);
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}


app.use(cors(corsOptions))
app.use(express.json());
app.use(session({
    secret: "mi-llave-secreta",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: sessionStore
}))

app.use("/api/auth", routerAuth);

export default app