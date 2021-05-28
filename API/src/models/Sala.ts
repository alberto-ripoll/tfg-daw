export interface Sala {
    id?: string;
    title?:string;
    entrenador?:string;
    description?: string;
    tipo?: string;
    image?: string | ArrayBuffer;
    link?:string;
    created_at?: Date;

}