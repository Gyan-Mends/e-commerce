export interface RegistrationInterface {
	_id:string,
	firstName:string,
    middleName:string,
    lastName:string,
    email:string,
	password:string,
    phone:number,
	role:string,
    admin:string,
    image:string,
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