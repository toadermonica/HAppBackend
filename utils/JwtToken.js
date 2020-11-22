import jwt from 'jsonwebtoken';
require('dotenv').config();

export async function getTokens(email){
    const payload = {
        email: email
    };
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);
    return ({accessToken : accessToken, refreshToken : refreshToken});
}

export function verifyTokenAndGetUser(refreshToken) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
        if (err) return null;
        return user;
    });
}

export function generateAccessToken(payload) {
    return Promise.resolve(jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '600000' }));
}
export function generateRefreshToken(payload) {
    return Promise.resolve(jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET));
}

export function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).send({"error": 'Missing token'});
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) {
            return res.status(403).send(err);
        }
        req.user = user;
        next();
    });
}
