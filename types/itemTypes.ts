export interface TreeItem {
    id: string;
    title: string;
    itemType: string;
    index: number;
    children?: TreeItem[];
    parentId: string | null;
}