import jwt from 'jsonwebtoken';
import express from 'express';
import { UserService } from '../services/UserService';
import { encrypt } from '../util/crypt';

interface UserTokenInfo {
    id: string;
    username: string;
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserTokenInfo;
        }
    }
}

export const authLogin = async (req: express.Request, res: express.Response) => {
    const username = req.body['username'] as string;
    const password = req.body['password'] as string;

    const dbUser = await new UserService().authenticateUser(username, password);

    if (!dbUser)
        return res.status(403).json({ message: "Invalid username or password" });

    const tokenInfo : UserTokenInfo = {
        id: encrypt(dbUser.id),
        username: dbUser.username,
        name: dbUser.name,
        email: dbUser.email
    };

    const token = generateAccessToken(tokenInfo);
    const refreshToken = jwt.sign (tokenInfo, process.env['REFRESH_TOKEN_SECRET'] as string, { expiresIn: '1d' });
    
    return res.json({accessToken: token, refreshToken});
};

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env['ACCESS_TOKEN_SECRET'] as string, {}, (err: any, user: any) => {
        if (err) res.sendStatus(403);
        req.user = user as UserTokenInfo;
        return next();
    });
    return;
}

export const generateAccessToken = (user: any) => {
    return jwt.sign(user, process.env['ACCESS_TOKEN_SECRET'] as string, { expiresIn: '3h' });
}

export const refreshToken = (req: express.Request, res: express.Response) => {
    const refreshToken = req.body['token'];

    if (!refreshToken) return res.sendStatus(401);
    // Possible for validation for token inspection: if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env['REFRESH_TOKEN_SECRET'] as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const newToken = generateAccessToken({ username: user.username });
        res.json({ accessToken: newToken });
        return;
    });

    return;
}