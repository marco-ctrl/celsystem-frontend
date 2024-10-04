import { Link } from "../../interfaces/links.interface";
import { Celula } from "./celula-admin.interface";
import { Asistente, Visita } from "./miembro-admin.interface";

export interface InformeResponse{
    status: boolean;
    report: Report;
    message: string | null;
}

export interface ListInformes {
    status: boolean;
    reports: Reports;
}

export interface Reports {
    current_page: number;
    data: Report[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
}

export interface Report {
    id:               number;
    datetime:         Date;
    assistant_amount: number;
    visit_amount:     number;
    offering:         number;
    payment_method:   number;
    voucher:          null;
    celula_id:        number;
    status:           number;
    photo:            File | string | null | undefined;
    celula:           Celula;
    asistencia:       Asistente[] | null | undefined;
    visita:           Visita[] | null | undefined;
}

export interface InformeForm{
    offering:         number;
    celula_id:        number;
    photo:            File | null;
    asistencia:       Asistente[];
    visita:           Visita[] | null;

}
