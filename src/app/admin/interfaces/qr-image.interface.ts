import { Pagination } from "../../interfaces/pagination";

export interface QrImageResponse {
    status:   boolean;
    qrImage: QrImage;
    message:  string | null;
}

export interface QrImagesResponse {
    status:   boolean;
    qrImages: QrImagesPagination;
    message:  string | null;
}

export interface QrImagesPagination extends Pagination {
    data:           QrImage[];
}

export interface QrImage {
    id:          number;
    description: Date;
    valid_from:  Date;
    expired:     string;
    image:       string | File | null;
    amount:      string;
    status:      number;
}