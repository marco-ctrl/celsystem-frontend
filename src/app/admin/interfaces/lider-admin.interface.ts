import { Link } from "../../interfaces/links.interface";
import { User } from "../../auth/interfaces";
import { Celula } from "./celula-admin.interface";

export interface LiderResponse{
    status:  boolean;
    message: string | null;
    lider:   Lider | null;
}

export interface ListLideres {
    status:  boolean;
    lideres: Lideres;
}

export interface Lideres {
    current_page:   number;
    data:           Lider[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  string | null;
    to:             number;
    total:          number;
}

export interface Lider {
    id:        number;
    name:      string;
    lastname:  string;
    birthdate: Date;
    addres:    string;
    contact:   string;
    foto:      string;
    foto_url:  string;
    user_id:   number;
    status:    number;
    celula:    Celula | null;
    user:      User;
}

export interface LiderForm {
    name:      string;
    lastname:  string;
    birthdate: Date;
    addres:    string;
    contact:   string;
    foto:      string;
    email:     string;
}