import { User } from '../entities';

export interface CreateUserRequestBody {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface CreateUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    token: string;
}

export interface loginRequestBody {
    username: string;
    password: string;
}
