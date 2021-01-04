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

export async function generateAccessToken(payload) {
    return Promise.resolve(jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '600000' }));
}
export async function generateRefreshToken(payload) {
    return Promise.resolve(jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '3 days'}));
}

export function verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, decodedPayload) {
        if (err) return null;
        return decodedPayload;
    });
}

export function authenticateToken(req, res, next) {
    const accessToken = req.headers['authorization'];
    if(!accessToken){
        return res.status(401).send({"error": 'Missing token'});
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (error) {
        if (error) {
            return res.status(400).send({error});
        }
    });
    next();
}
