import { Pagination } from "../../interfaces/pagination";

export interface MemberResponse {
    status:  boolean;
    members: MembersPagination;
}

export interface MembersPagination extends Pagination {
    data:           Member[];
}

export interface Member {
    id:        number;
    name:      string;
    lastname:  string;
    contact:   string;
    tipe:      number;
    celula_id: number;
    status:    number;
    celula:    Celula;
}

export interface Celula {
    id:       number;
    number:   number;
    name:     string;
    addres:   string;
    day:      number;
    hour:     string;
    tipe:     number;
    latitude: string;
    length:   string;
    lider_id: number;
    status:   number;
}