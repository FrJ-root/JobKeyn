export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
