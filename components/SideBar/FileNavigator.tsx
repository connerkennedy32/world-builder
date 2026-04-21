import React from "react"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { FileTree } from "../FileTree/FileTree"

export function FileNavigator({ data, controller }: { data: any; controller: any }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="px-1">
                <FileTree data={data} controller={controller} />
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
