import { ROLE } from "./enum/enumes";

export interface HasIncludes<T = {}> {
    includes: T;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password : string;
    password_confirmation:string;
    role: ROLE.ADMIN | ROLE.AGENT | ROLE.USER
}

export interface LoginResponse {
    token: string;
    user: User;
}


export interface JsonApiResponse {
    data: any;
    message: string;
    success: boolean;
    meta?: Meta;
}

export interface JsonApiItem<T> {
    id: string;
    type: string;
    attributes: T;
}

export interface Meta {
    current_page?: number;
    last_page?: number;
    total?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: any;
    links: any;
}

export interface Faq extends HasIncludes <{id:number,name:string}>{
    id: number;
    question: string;
    answer: string;
    category: string;
    created_at: Date;
}

export interface Ticket extends HasIncludes<{user:User,agent:User,category:Category}>{
    id: number;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'resolved' | 'closed';
    created: string;
}

export interface Category extends HasIncludes{
    id: number;
    name: string;
}




export interface DropDownContent {
    id: number;
    label: string;
    action: (data?:any) => void;
}
