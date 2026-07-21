import validator from "validator";
import { connection } from "../database/db.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(422)
          .send("Campos name, email, password son requeridos");
      }

      if (!validator.isEmail(email)) {
        return res.status(422).send("Campo email es invalido");
      }

      const [results, fields] = await connection.query(
        "SELECT * FROM users WHERE `email` = ?",
        [email],
      );

      if (results.length > 0) {
        return res.status(409).send("Email ya existe, por favor coloca otro");
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

      if ((error.code = "ERP_DUP_ENTRY")) {
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

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1m",
        },
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        },
      );

      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const expiresAt = new Date(Date.now() + 604800000);

      await connection.query(
        "INSERT INTO refresh_tokens (userId, tokenHash, expiresAt) VALUES (?, ?, ?)",
        [user.id, tokenHash, expiresAt],
      );

      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        refreshToken,
        accessToken,
      });
    } catch (error) {
      console.error("Error en login:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async profile(req, res) {
    try {
      const userId = req.userId;

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
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token requerido" });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await connection.query(
      "DELETE FROM refresh_tokens WHERE tokenHash = ?",
      [tokenHash],
    );

    return res.status(200).json({
      message: "Logout exitoso",
    });
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token requerido" });
      }

      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const [rows] = await connection.query(
        "SELECT * FROM refresh_tokens WHERE tokenHash = ?",
        [tokenHash],
      );

      const storedToken = rows[0];

      if (!storedToken) {
        return res.status(401).json({ error: "Refresh token inválido" });
      }

      if (storedToken.expiresAt.getTime() < Date.now()) {
        await connection.query(
          "DELETE FROM refresh_tokens WHERE tokenHash = ?",
          [tokenHash],
        );

        return res.status(401).json({ error: "Refresh token expirado" });
      }

      const accessToken = jwt.sign(
        { userId: storedToken.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: "1m",
        },
      );

      return res.status(200).json({
        accessToken,
      });
    } catch (error) {
      console.error("Error en refreshToken:", error.message);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
