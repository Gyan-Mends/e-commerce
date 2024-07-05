export interface RegistrationInterface {
    _id: string;
    name: string;
    email: string;
    password: string;
    image: string;
}

export interface CategoryInterface {
    _id: string;
    name: string
    description: string
    seller: string
}

export interface ProductInterface {
    _id: string,
    name: string,
    price:number,
    quantity:number,
    category: string,
    image:string,
    low_Stock: string,
    description:string
    seller: string
}