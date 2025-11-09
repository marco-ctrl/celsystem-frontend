export interface Cards {
    status: boolean;
    data:   Card[];
}

export interface Card {
    color:  string;
    length: number;
    title:  string;
    icon:   string;
}

export interface TotalMembers {
    tipe:   string[];
    total:  number[];
    status: boolean;
}