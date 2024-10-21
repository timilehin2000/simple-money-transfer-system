import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { BadRequestError } from '../helpers/errorHandlers/apiError';

const jwtSecret = process.env.JWT_SECRET!;

interface GenerateToken {
    username: string;
    id: string;
}

export const generateAccessToken = (body: GenerateToken) => {
    const token: string = sign(
        { username: body.username, id: body.id },
        jwtSecret,
        {
            expiresIn: '10m',
        },
    );

    return token;
};

export const verifyToken = (token: string): JwtPayload => {
    const decoded = verify(token, jwtSecret) as JwtPayload;

    return decoded;
};
