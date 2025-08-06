import { Router } from 'express';
import Authentication from "../Controllers/Authentication.js";

const AuthRouter = Router();

// Group authentication routes under "/auth"

// 📝 Routes publiques (pas d'authentification requise)
AuthRouter.post('/register', Authentication.Register);
AuthRouter.post('/login', Authentication.Login);

// 🔐 Routes protégées (authentification requise)
AuthRouter.get('/me', Authentication.verifyToken, Authentication.me);
AuthRouter.post('/logout', Authentication.Logout);

// 🔄 Route optionnelle pour refresh token (si vous implémentez cette fonctionnalité)
// AuthRouter.post('/refresh', Authentication.refreshToken);

export default AuthRouter;