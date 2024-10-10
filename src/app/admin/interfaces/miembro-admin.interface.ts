
import { Link } from "../../interfaces/links.interface";
import { Celula } from "./celula-admin.interface";

export interface MemberResponse {
    status:  boolean;
    member: Miembro | null;
    message: string | null;
}

export interface ListMember {
    status:  boolean;
    members: Members | null;
}

export interface Members {
    current_page:   number;
    data:           Miembro[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
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