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
