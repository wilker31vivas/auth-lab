import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: "Necesitás iniciar sesión para acceder a este recurso",
    });
  }

  const token = authToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Credenciales inválidas ",
    });
  }
}
