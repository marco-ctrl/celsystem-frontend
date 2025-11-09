

import { Pagination } from "../../interfaces/pagination";
import { Celula } from "./celula-admin.interface";

export interface MemberResponse {
    status:  boolean;
    member: Miembro | null;
    message: string | null;
}

export interface ListMemberResponse {
    status:  boolean;
    members: MembersPagination | null;
    message: string | null;
}

export interface MembersPagination extends Pagination {
    data:           Miembro[];
}

export interface ListAsistentes{
    status: boolean,
    members: Miembro[] | null
}

export interface Miembro{
    id:        number | null, 
    name:      string, 
    lastname:  string, 
    contact:   string | null, 
    tipe:      number, 
    celula_id: number, 
    status:    number,
    celula:    Celula | null, 
}

export interface Asistente{
    id:        number | null, 
    name:      string, 
    lastname:  string, 
    contact:   string | null, 
    tipe:      number, 
    celula_id: number, 
    status:    number,
    pivot:     Pivot | null | undefined;
}

export interface Visita{
    id:        number | null,  
    name:      string, 
    lastname:  string, 
    contact:   string | null, 
    tipe:      number, 
    celula_id: number, 
    status:    number,
    pivot:     Pivot | null | undefined;
}

export interface Pivot {
    report_id: number;
    member_id: number;
}