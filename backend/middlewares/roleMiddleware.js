const verifyRole = (allowedRoles) => { // Función middleware para verificar el rol del usuario
     return (req, res, next) => {// Función middleware que se ejecuta después de la verificación del token JWT
         if (!req.user || !req.user.nombre_rol) {
             return res.status(403).json({ mensaje: 'Información de rol no disponible.' });// Verifica si la información del rol del usuario está disponible en la solicitud. Si no está disponible, se devuelve un error 403 indicando que la información de rol no está disponible.
             }
         if (!allowedRoles.includes(req.user.nombre_rol)) {
             return res.status(403).json({ mensaje: `Acceso no autorizado. Se requiere rol de [${allowedRoles.join(', ')}].`
             });// Verifica si el rol del usuario está incluido en los roles permitidos. Si no está incluido, se devuelve un error 403 indicando que el acceso no está autorizado y se especifican los roles requeridos.
        } next();
    };
};
 
module.exports = verifyRole;