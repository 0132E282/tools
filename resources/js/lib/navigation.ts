export type NavItem = {
    title: string;
    url: string;
    icon?: string;
    items?: { title: string; url: string }[];
};

export type NavigationConfig = {
    main: NavItem[];
    footer: NavItem[];
};
