export interface Page {
    id: number;
    content: string;
    title: string;
    folderId: number | null;
    userId: number;
    order: number;
    pages?: Page[]
    children?: Page[]
}

export interface Folder {
    id: number;
    title: string;
    order: number;
    pages?: Page[]
    children?: Page[]
}