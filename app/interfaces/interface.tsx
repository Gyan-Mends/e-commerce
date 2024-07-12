import { Schema } from "mongoose";

export interface RegistrationInterface {
	_id:string,
	firstName:string,
    middleName:string,
    lastName:string,
    email:string,
	password:string,
    phone:string,
	role:string,
    admin:string,
    image:string,
}
export interface SuppliersInterface {
	_id:string,
	firstName:string,
    middleName:string,
    lastName:string,
    email:string,
    phone:string,
    admin:string,
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
export interface CartInterface {
    _id: string,
    product:string,
    attendant:string,
    quantity:string,
    price:string,
}
export interface SalesInterface {
    product: Schema.Types.ObjectId;
    quantity: number;
  attendant:Schema.Types.ObjectId;
  totalAmount: string;
  amountPaid: string;
  balance: string;
  createdAt?: Date;
  updatedAt?: Date;
}

