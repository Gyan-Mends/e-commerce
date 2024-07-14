import { Schema } from "mongoose";

export interface RegistrationInterface {
    _id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    admin: string,
    image: string,
}
export interface SuppliersInterface {
    _id: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    phone: string,
    admin: string,
}

export interface CategoryInterface {
    _id: string;
    name: string
    description: string
    seller: string
}

export interface ProductInterface {
    products:string
    _id: string,
    name: string,
    costPrice: string,
    price: number,
    quantity: number,
    category: string,
    image: string,
    low_stock: string,
    description: string
    seller: string
}
export interface CartInterface {
    _id: string,
    product: string,
    attendant: string,
    quantity: string,
    price: string,
}
export interface SalesInterface {
    _id:string
    product: ProductInterface;
    quantity: number;
    attendant: RegistrationInterface;
    totalAmount: string;
    amountPaid: string;
    balance: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
export interface RefundInterface {
    _id:string
    product: ProductInterface;
    quantity: number;
    attendant: RegistrationInterface;
    totalAmount: string;
    amountPaid: string;
    balance: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}