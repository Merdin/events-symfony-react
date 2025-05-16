import { apiClient } from './client';

type LoginCredentials = {
    email: string;
    password: string;
};

type LoginResponse = {
    token: string;
}

type RegisterCredentials = LoginCredentials;

type RegisterResponse = {
    id: number;
    email: string;
}

export const login = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await apiClient
            .post<LoginResponse>('/login', { email, password });

        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const register = async ({email, password}: RegisterCredentials): Promise<RegisterResponse> => {
    try {
        const response = await apiClient.post<RegisterResponse>('/register', { email, password });

        if (response.status < 200 || response.status >= 300) {
            throw new Error(response.statusText);
        }

        return response.data;
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.data?.message || 'Creating account failed.');
    }
}
