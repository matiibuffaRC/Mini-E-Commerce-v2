export type Product = {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    id_categoria: number | null;
};

export type Category = {
    id: number;
    nombre: string;
};