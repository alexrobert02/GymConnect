import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const instance = axios.create({
    baseURL: 'http://localhost:8222',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const securedInstance = axios.create({
    baseURL: 'http://localhost:8222',
    headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});


export const resetPassword = async (
    newPassword: string,
    token: string
): Promise<void> => {
    try {
        
        await instance.post(`/api/v1/auth/reset-password?token=${token}`, {
            newPassword,
        });
    } catch (error) {
        throw error;
    }
};


interface DecodedToken {
    role: string;
}

const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        console.error("Token-ul nu a putut fi decodat.", error);
        return null;
    }
};




export default instance;

