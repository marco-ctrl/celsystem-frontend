import { Lider } from "./lider-admin.interface";
import { Link } from "./temas.interface";
import { Pagination } from "../../interfaces/pagination";

export interface CelulaResponse{
    status:  boolean;
    message: string | null;
    celula:  Celula | null;
}

export interface ListCelulasResponse {
    status:  boolean;
    celulas: CelulasPagination;
    message?: string; 
}

export interface CelulasPagination extends Pagination {
    data:           Celula[];
}

export interface Celula {
    id:       number;
    number:   number;
    name:     string;
    addres:   string;
    day:      number;
    hour:     string;
    latitude: number;
    length:   number;
    lider_id: number;
    tipe:     number;
    status:   number;
    lider:    Lider | null;
}

export interface CelulaForm {
    id:       number;
    number:   number;
    name:     string;
    addres:   string;
    day:      number;
    hour:     string;
    latitude: number;
    length:   number;
    lider_id: number;
    tipe: number;
    status:   number;
}