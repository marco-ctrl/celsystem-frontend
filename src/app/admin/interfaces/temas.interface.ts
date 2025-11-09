export interface TemaResponse{
    status:  boolean;
    message: string;
    lesson: Lesson;
}

export interface Temas {
    status:  boolean;
    lessons: Lessons;
}

export interface Lessons {
    current_page:   number;
    data:           Lesson[];
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

export interface Lesson {
    id:          number;
    tema:        string;
    description: string;
    date:        Date;
    archive:     string;
    status:      number;
}

export interface TemaForm {
    tema:        string;
    description: string;
    file:     File;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}

