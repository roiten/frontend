export type Tool = {
    name: string;
    icon?: string;
    action?: (...args: any) => void;
};

