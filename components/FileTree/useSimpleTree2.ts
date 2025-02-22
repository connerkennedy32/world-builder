import { useMemo, useState } from "react";
import { SimpleTree } from "./simple-tree";
import {
    DeleteHandler,
    MoveHandler,
    RenameHandler,
} from "react-arborist";
import { useCreatePage, useCreateFolder, useSavePageOrder, useDeletePage, useUpdatePage } from "@/hooks";
import { TreeItem } from "@/types/itemTypes";
export type SimpleTreeData = {
    id: string;
    title: string;
    itemType: string;
    children?: SimpleTreeData[];
};
import { toast } from "@/hooks/use-toast"


export function useSimpleTree2<T extends TreeItem>(initialData: readonly T[]) {
    const { mutate: createPage } = useCreatePage();
    const { mutate: createFolder } = useCreateFolder();
    const { mutate: savePageOrder } = useSavePageOrder();
    const { mutate: deletePage } = useDeletePage();
    const { mutate: updatePage } = useUpdatePage();

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
        savePageOrder(tree.data, {
            onSuccess: () => {
                setData(tree.data);
            },
            onError: (error) => {
                toast({
                    title: "Page order save failed",
                    description: "Failed to save page order",
                    variant: "destructive",
                });
                console.error("Failed to save page order:", error);
            }
        });
    };

    const onRename: RenameHandler<T> = ({ name, id }) => {
        tree.update({ id, changes: { title: name } as any });
        setData(tree.data);
        updatePage({ page_id: id, title: name }, {
            onSuccess: () => {
                toast({
                    title: "Page renamed",
                    description: `'${name}' renamed successfully`,
                });
            },
            onError: (error) => {
                toast({
                    title: "Page renaming failed",
                    description: `'${name}' renaming failed`,
                    variant: "destructive",
                });
                console.error("Failed to rename page:", error);
            }
        });
    };

    const onCreate = ({ parentId, index, itemType, title }: { parentId: string | null, index: number, itemType: string, title: string }) => {
        const data = { id: crypto.randomUUID(), title: title, itemType: itemType, index: index } as any;
        data.children = [];
        if (itemType === "PAGE") {
            createPage(data, {
                onSuccess: () => {
                    tree.create({ parentId, index, data });
                    setData(tree.data);
                    toast({
                        title: "Page created",
                        description: `'${title}' created successfully`,
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Page creation failed",
                        description: `'${title}' creation failed`,
                        variant: "destructive",
                    });
                    console.error("Failed to create page:", error);
                }
            });
        } else if (itemType === "FOLDER") {
            createFolder(data, {
                onSuccess: () => {
                    tree.create({ parentId, index, data });
                    setData(tree.data);
                    toast({
                        title: "Folder created",
                        description: `'${title}' created successfully`,
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Folder creation failed",
                        description: `'${title}' creation failed`,
                        variant: "destructive",
                    });
                    console.error("Failed to create folder:", error);
                }
            });
        }
        return data;
    };

    const onDelete: DeleteHandler<T> = (args: { ids: string[], source?: string }) => {
        if (args.source !== "confirm_modal") {
            return;
        }
        args.ids.forEach((id) => {
            const findItemInTree = (items: any[], targetId: string): any => {
                for (const item of items) {
                    if (item.id === targetId) return item;
                    if (item.children?.length) {
                        const found = findItemInTree(item.children, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };

            const item = findItemInTree(tree.data, id);
            if (item?.itemType === "PAGE") {
                deletePage(id, {
                    onSuccess: () => {
                        tree.drop({ id });
                        setData(tree.data);
                        toast({
                            title: "Page deleted",
                            description: `'${item.title}' deleted successfully`,
                        });
                    },
                    onError: (error) => {
                        console.error("Failed to delete page:", error);
                        toast({
                            title: "Page deletion failed",
                            description: `'${item.title}' deletion failed`,
                            variant: "destructive",
                        });
                    }
                });
            }
        });
    };

    const controller = { onMove, onRename, onCreate, onDelete };

    return [data, controller] as const;
}