import validator from "validator";
import { connection } from "../database/db.js";
import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

export class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(422)
          .send({ error: "Campos name, email, password son requeridos" });
      }

      if (!validator.isEmail(email)) {
        return res.status(422).send({ error: "Campo email es invalido" });
      }

      const [results, fields] = await connection.query(
        "SELECT * FROM users WHERE `email` = ?",
        [email],
      );

      if (results.length > 0) {
        return res
          .status(409)
          .send({ error: "Email ya existe, por favor coloca otro" });
      }

      const passwordHash = await bcryptjs.hash(password, SALT_ROUNDS);

      const [result] = await connection.query(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash],
      );

      return res.status(201).json({
        id: result.insertId,
        email,
        name,
      });
    } catch (error) {
      console.error("Error en registro:", error);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "El email ya está registrado" });
      }

      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(401).send("Email y contraseña son requeridos");
      }

      const [rows] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
      );

      const user = rows[0];

      if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      const passwordMatch = await bcryptjs.compare(
        password,
        user.password_hash,
      );

      if (!passwordMatch) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      req.session.userId = user.id;

      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("Error en login:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async profile(req, res) {
    try {
      const { userId } = req.session;

      const [rows] = await connection.query(
        "SELECT id, email, name FROM users WHERE id = ?",
        [userId],
      );

      const user = rows[0];

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      console.error("Error en profile:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error en logout:", err.message);
        return res.status(500).json({ error: "Error a borrar la sesion" });
      }
      res.clearCookie("connect.sid");

      return res.status(200).json({
        message: "Sesion borrada efectivamente",
      });
    });
  }
}
