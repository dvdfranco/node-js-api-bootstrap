import jwt from 'jsonwebtoken';
import express from 'express';

interface AuthUser {
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

let refreshTokens: string[] = [];

export const authLogin = (req: express.Request, res: express.Response) => {
    const username = req.body['username'] as string;
    //const password = req.body['password'] as string;

    const user : AuthUser = { username };

    const token = generateAccessToken(user);
    const refreshToken = jwt.sign (user, process.env['REFRESH_TOKEN_SECRET'] as string);
    refreshTokens.push(refreshToken);
    console.log("pushed", refreshToken);
    
    res.json({accessToken: token, refreshToken});
};

export const authLogout = (req: express.Request, res: express.Response) => {
    const refreshToken = req.body['token'];
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.sendStatus(204);
}

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env['ACCESS_TOKEN_SECRET'] as string, {}, (err: any, user: any) => {
        if (err) res.sendStatus(403);
        console.log("type", typeof(user));
        req.user = user as AuthUser;
        return next();
    });
    return;
}

export const generateAccessToken = (user: any) => {
    return jwt.sign(user, process.env['ACCESS_TOKEN_SECRET'] as string, { expiresIn: '10s' });
}

export const refreshToken = (req: express.Request, res: express.Response) => {
    const refreshToken = req.body['token'];
    console.log("list", refreshTokens);

    if (!refreshToken) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env['REFRESH_TOKEN_SECRET'] as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const newToken = generateAccessToken({ username: user.username });
        res.json({ accessToken: newToken });
        return;
    });

    return;
}