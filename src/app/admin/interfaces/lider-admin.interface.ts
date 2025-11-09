import { User } from "../../auth/interfaces/req-response";
import { Pagination } from "../../interfaces/pagination";
import { Celula } from "./celula-admin.interface";

export interface LiderResponse {
    status: boolean;
    message: string | null;
    lider: Lider | null;
    user: UserLider | null;
    pass: string | null;
    token: string;
}

export interface ListLideresResponse {
    status: boolean;
    lideres: LideresPagination;
    message?: string,
}

export interface LideresPagination extends Pagination {
    data: Lider[];
}

export interface Lider {
    id: number;
    name: string;
    lastname: string;
    birthdate: Date;
    addres: string;
    contact: string;
    foto: string;
    foto_url: string;
    user_id: number;
    status: number;
    celula: Celula | null;
    user: User;
    code: string | null;
}

export interface LiderForm {
    name: string;
    lastname: string;
    birthdate: Date;
    addres: string;
    code: string;
    contact: string;
    foto: string;
    email: string;
}

export interface UserLider {
    email: string;
    id: number;
    name: string;
    tipe: number;
}