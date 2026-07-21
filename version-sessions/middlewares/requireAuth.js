export function requireAuth(req, res, next) {
    const sessionId = req.session.userId

    if(!sessionId) {
        return res.status(401).json({
            error: "Necesitás iniciar sesión para acceder a este recurso"
        }) 
    }
    
    next()
}