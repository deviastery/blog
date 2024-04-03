export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
};

export type RouteConfig = {
    path: string;
    element: JSX.Element;
};

