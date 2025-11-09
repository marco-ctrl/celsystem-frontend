export interface CelulaResponse {
    status: boolean;
    celula: Celula;
    message: string | null;
}

export interface Celula {
    id:       number;
    number:   number;
    name:     string;
    addres:   string;
    day:      number;
    hour:     string;
    tipe:     number;
    latitude: number;
    length:   number;
    lider_id: number;
    status:   number;
    lider:    Lider;
}

export interface Lider {
    id:        number;
    name:      string;
    lastname:  string;
    birthdate: Date;
    addres:    string;
    contact:   string;
    foto:      null;
    user_id:   number;
    status:    number;
    code:      null;
}