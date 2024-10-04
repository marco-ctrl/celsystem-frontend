import { Link } from "../../interfaces/links.interface";
import { Lider } from "./lider-admin.interface";

export interface CelulaResponse{
    status:  boolean;
    message: string | null;
    celula:  Celula | null;
}

export interface ListCelulas {
    status:  boolean;
    celulas: Celulas;
}

export interface Celulas {
    current_page:   number;
    data:           Celula[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
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
    status:   number;
}