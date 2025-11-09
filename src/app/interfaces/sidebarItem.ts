export interface SidebarItem {
    url: string,
    title: string,
    icon: string,
    subItems: SubItems[] | null | undefined
}

export interface SubItems {
    url: string,
    title: string,
    icon: string,
}
