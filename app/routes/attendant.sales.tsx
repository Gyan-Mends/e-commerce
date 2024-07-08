import { Button, Input } from "@nextui-org/react"
import { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react"
import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import CartIcon from "~/components/icons/CartIcon"
import { DeleteIcon } from "~/components/icons/DeleteIcon"
import PlusIcon from "~/components/icons/PlusIcon"
import { SearchIcon } from "~/components/icons/SearchIcon"
import ConfirmModal from "~/components/modal/confirmModal"
import EditModal from "~/components/modal/EditModal"
import { errorToast, successToast } from "~/components/toast"
import cartController from "~/controllers/cart"
import productsController from "~/controllers/productsController"
import { CartInterface, ProductInterface } from "~/interfaces/interface"
import AttendantLayout from "~/layout/attendantLayout"

const Sales = () => {
    const { product, user, carts, totalQuantity, totalPrice } = useLoaderData<{ product: ProductInterface[], user: { _id: string }, carts: CartInterface[], totalQuantity: number, totalPrice: number }>()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSuppliers, setFilteredSuppliers] = useState(product);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false)
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false)
    const [dataValue, setDataValue] = useState<ProductInterface>()
    const [cartDataValue, setCartDataValue] = useState<CartInterface>()

    const [quantity, setQuantity] = useState(1)
    const actionData = useActionData<any>()
    const submit = useSubmit()

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpened(false)
    }
    const handleConfirmModalClosed = () => {
        setIsConfirmModalOpened(false)
    }

    useEffect(() => {
        const filtered = product.filter(product => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            return (
                product.name.toLowerCase().includes(lowerCaseQuery)

            );
        });
        setFilteredSuppliers(filtered);
    }, [searchQuery, product]);

    useEffect(() => {
        if (actionData) {
            if (actionData.success) {
                successToast(actionData.message)
            } else {
                errorToast(actionData.message)
            }
        }
    }, [actionData])

    return (
        <AttendantLayout pageName="Sales Point">
            <Toaster position="top-center" />


            <div className="lg:grid lg:grid-cols-3 gap-10 mt-6">
                <div className="col-span-2  h-[85vh]" >
                    {/* search */}
                    <div>
                        <Input
                            placeholder="Search product..."
                            startContent={<SearchIcon className="" />}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            classNames={{
                                inputWrapper: "h-14 lg:w-80",
                            }}
                        />
                    </div>


                    {/* product items */}
                    <div className="mt-4 lg:grid lg:grid-cols-4 gap-10 overflow-y-scroll h-[76vh] rounded-lg overflow-x-hidden" >
                        {filteredSuppliers.map((products: ProductInterface, index: number) => (
                            <div className="lg:w-[13vw] rounded-lg p-2 lg:h-[30vh] mt-4 bg-slate-800 " key={index} onClick={() => {
                                setIsEditModalOpened(true)
                                setDataValue(products)
                            }}>
                                <div className="h-[19vh] w-full">
                                    <img className="rounded-lg h-[19vh] w-full" src={products?.image} alt="" />
                                </div>
                                <p className="font-poppins mt-4 text-sm">{products?.name}</p>
                                <div className="flex justify-between">
                                    <p className="font-poppins mt-4 text-xl text-primary">GHC {products?.price}</p>
                                    <p className="font-poppins mt-4 text-sm">{products?.quantity} items</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="h-[85vh] flex flex-col justify-between">
                    <div className=" h-[53vh] overflow-y-scroll">
                        <Button></Button>
                        {/* added items comes here */}
                        {carts.map((cart: CartInterface, index: number) => (
                            <div key={index} className="h-20 w-full bg-slate-800 mt-4 rounded-lg p-2 flex gap-10">
                                <div className="h-16 w-20">
                                    <img className="h-16 w-20 rounded-lg" src={cart?.product?.image} alt="" />
                                    <input type="text" name="" value={cart?.product?.image} id="" />

                                </div>
                                <div className="flex flex-col justify-between w-full">
                                    <div>
                                        <div className="flex justify-between">
                                            <p className="font-poppins text-lg">{cart?.product?.name}</p>
                                            <button className="text-danger" onClick={() => {
                                                setIsConfirmModalOpened(true);
                                                setCartDataValue(cart)
                                            }}><DeleteIcon /></button>

                                        </div>
                                    </div>
                                    <div className="flex justify-between ">
                                        <p className="font-poppins text-sm">{cart?.quantity?.length === 1 ? (<> {cart.quantity} item</>) : (<>{cart.quantity} items</>)}</p>
                                        <p className="font-poppins text-md">Ghc {cart?.product?.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-900 h-60 flex flex-col justify-between rounded-xl px-10 py-10 text-white">
                        <div>
                            <div className="flex justify-between">
                                <p className="text-md font-poppins">Quantity</p>
                                <p className="text-md font-poppins"> {totalQuantity}</p>
                            </div>
                            <div className="flex justify-between mt-8">
                                <p className="text-md font-poppins">Total</p>
                                <p className="text-md font-poppins">Ghc {totalPrice}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button className=" w-80 h-14 text-xl font-poppins" color="primary" onClick={() => {
                                setCartDataValue(carts)
                            }}>
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal isOpen={isConfirmModalOpened} onOpenChange={handleConfirmModalClosed}>
                <div className="flex gap-4">
                    <Button color="primary" variant="flat" className="font-poppins text-md" onPress={handleConfirmModalClosed}>
                        No
                    </Button>
                    <Button color="danger" variant="flat" className="font-poppins text-md" onClick={() => {
                        setIsConfirmModalOpened(false)
                        if (cartDataValue) {
                            submit({
                                intent: "delete",
                                id: cartDataValue?._id
                            }, {
                                method: "post"
                            })
                        }
                    }} >
                        Yes
                    </Button>
                </div>
            </ConfirmModal>

            <EditModal modalTitle="" className="bg-slate-800" onOpenChange={handleEditModalClose} isOpen={isEditModalOpened}>
                {(onClose) => (
                    <Form method="post">
                        <div className="flex flex-col justify-center ">
                            <input type="hidden" name="quantity" value={quantity} />
                            <input type="hidden" name="attendant" value={user?._id} />
                            <input type="hidden" name="product" value={dataValue?._id} />
                            <input type="hidden" name="price" value={dataValue?.price} />
                            <input type="hidden" name="intent" value="addToCart" />
                            <p className="text-4xl font-poppins">{dataValue?.name}</p>
                            <p className="text-2xl font-poppins mt-4">GHC {dataValue?.price}</p>
                        </div>
                        <div className="flex justify-start gap-8 mt-10 font-poppins">
                            <Button color="danger" className="h-20" variant="flat" onClick={() => {
                                setQuantity(quantity - 1)
                            }}>
                                Close
                            </Button>
                            <div className="flex items-center justify-center">
                                <p>{quantity}</p>
                            </div>
                            <Button color="success" className="h-20" variant="flat" onClick={() => {
                                setQuantity(quantity + 1)
                            }}>
                                <PlusIcon className="h-60 w-60" />
                            </Button>

                        </div>
                        <button className="mt-10 bg-primary rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-primary h-16 w-60 font-poppins text-xl">
                            <CartIcon className="h-6 w-6" /> Add To Cart
                        </button>
                    </Form>
                )}
            </EditModal>
        </AttendantLayout>
    )
}

export default Sales

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData()
    const quantity = formData.get("quantity") as string
    const product = formData.get("product") as string
    const attendant = formData.get("attendant") as string
    const price = formData.get("price") as string
    const intent = formData.get("intent") as string
    const id = formData.get("id") as string
    console.log(quantity, product, attendant, intent);


    switch (intent) {
        case "addToCart":
            const cart = await cartController.AddToCart({
                request,
                intent,
                quantity,
                product,
                attendant,
                price,
            })
            return cart

        case "delete":
            const deleteItem = await cartController.DeleteItem({ id, intent });
            return deleteItem
        default:
            break;
    }
}

export const loader: LoaderFunction = async ({ request }) => {
    const { product, user } = await productsController.ProductFetch(request);

    const { carts, totalQuantity, totalPrice } = await cartController.FetchCart(request)

    return { product, user, carts, totalQuantity, totalPrice }
}