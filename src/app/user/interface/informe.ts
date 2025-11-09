import { Pagination } from "../../interfaces/pagination";
import { Celula } from "../../admin/interfaces/celula-admin.interface";
import { Asistente, Visita } from "../../admin/interfaces/miembro-admin.interface";

export interface InformeResponse{
    status: boolean;
    report: Report;
    message: string | null;
}

export interface ListInformesResponse {
    status: boolean;
    reports: ReportsPagination;
    message: string | null;
}

export interface ReportsPagination extends Pagination {
    data: Report[];
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
    lider:            string | null;
    name_celula:      string | null;
    address:          string | null;
    latitude:         number;
    length:           number;
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