import { useMemo, useState } from "react";
import { SimpleTree } from "./simple-tree";
import {
    DeleteHandler,
    MoveHandler,
    RenameHandler,
} from "react-arborist";
import { useCreatePage, useCreateFolder, useSavePageOrder } from "@/hooks";
import { TreeItem } from "@/types/itemTypes";
export type SimpleTreeData = {
    id: string;
    title: string;
    itemType: string;
    children?: SimpleTreeData[];
};


export function useSimpleTree2<T extends TreeItem>(initialData: readonly T[]) {
    const { mutate: createPage } = useCreatePage();
    const { mutate: createFolder } = useCreateFolder();
    const { mutate: savePageOrder } = useSavePageOrder();
    const [data, setData] = useState(initialData);
    const tree = useMemo(
        () =>
            new SimpleTree<// @ts-ignore
                T>(data),
        [data]
    );

    const onMove: MoveHandler<T> = (args: {
        dragIds: string[];
        parentId: null | string;
        index: number;
    }) => {
        for (const id of args.dragIds) {
            tree.move({ id, parentId: args.parentId, index: args.index });
        }
        savePageOrder(tree.data);
        setData(tree.data);
    };

    const onRename: RenameHandler<T> = ({ name, id }) => {
        tree.update({ id, changes: { name } as any });
        setData(tree.data);
    };

    const onCreate = ({ parentId, index, itemType, title }: { parentId: string | null, index: number, itemType: string, title: string }) => {
        const data = { id: crypto.randomUUID(), title: title, itemType: itemType, index: index } as any;
        data.children = [];
        if (itemType === "PAGE") {
            createPage(data, {
                onSuccess: () => {
                    tree.create({ parentId, index, data });
                    setData(tree.data);
                },
                onError: (error) => {
                    console.error("Failed to create page:", error);
                }
            });
        } else if (itemType === "FOLDER") {
            createFolder(data, {
                onSuccess: () => {
                    tree.create({ parentId, index, data });
                    setData(tree.data);
                },
                onError: (error) => {
                    console.error("Failed to create folder:", error);
                }
            });
        }
        return data;
    };

    const onDelete: DeleteHandler<T> = (args: { ids: string[] }) => {
        args.ids.forEach((id) => tree.drop({ id }));
        setData(tree.data);
    };

    const controller = { onMove, onRename, onCreate, onDelete };

    return [data, controller] as const;
}