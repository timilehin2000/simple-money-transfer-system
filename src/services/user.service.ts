import { User } from '../entities/user.entity';
import {
    CreateUserRequestBody,
    loginRequestBody,
} from '../interfaces/user.interface';
import AppDataSource from '../data-source';
import {
    BadRequestError,
    NotFoundError,
} from '../helpers/errorHandlers/apiError';
import { Wallet } from '../entities';
import { generateAccessToken } from '../utils/jwt';
import redisClient from '../utils/cache';

const userRepository = AppDataSource.getRepository(User);
const walletRepository = AppDataSource.getRepository(Wallet);

export const createUser = async (body: CreateUserRequestBody) => {
    const { username } = body;

    const existingUser = await userRepository.findOne({
        where: { username: username.toLowerCase() },
    });

    if (existingUser) {
        throw new BadRequestError('Username already exists');
    }

    const user = userRepository.create({ ...body });

    const savedUser = await userRepository.save(user);

    //create wallet for user; default balance is 1000.00
    const wallet = walletRepository.create({ user: savedUser });

    await walletRepository.save(wallet);

    //omit user's password
    const { password: _, ...userResponse } = savedUser;

    const token = generateAccessToken({ username, id: user.id });

    return { ...userResponse, token };
};

export const login = async (body: loginRequestBody) => {
    const { username, password } = body;

    const existingUser = await userRepository.findOne({
        where: { username },
        select: ['password'],
    });

    if (
        !existingUser ||
        !(await User.comparePasswords(password, existingUser.password))
    ) {
        throw new BadRequestError('Invalid credentials');
    }

    const token = generateAccessToken({ username, id: existingUser.id });

    return token;
};

export const getUserDetails = async (username: string): Promise<User> => {
    const existingUser = await userRepository.findOne({ where: { username } });

    if (!existingUser) {
        throw new NotFoundError('User not found');
    }

    return existingUser;
};

export const getUserDetailsWithBalance = async (userId: string) => {
    const cacheKey = `user_balance_${userId}`;

    const cachedUserDetails = await redisClient.get(cacheKey);

    if (cachedUserDetails) {
        return JSON.parse(cachedUserDetails);
    }

    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['wallet'],
        select: ['id', 'username', 'firstName', 'lastName'],
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    const userDetails = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.wallet?.balance ?? 0,
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(userDetails));

    return userDetails;
};
