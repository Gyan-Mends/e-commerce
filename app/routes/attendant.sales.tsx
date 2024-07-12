import { Button, Input } from "@nextui-org/react";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import CartIcon from "~/components/icons/CartIcon";
import { DeleteIcon } from "~/components/icons/DeleteIcon";
import PlusIcon from "~/components/icons/PlusIcon";
import { SearchIcon } from "~/components/icons/SearchIcon";
import ConfirmModal from "~/components/modal/confirmModal";
import EditModal from "~/components/modal/EditModal";
import { errorToast, successToast } from "~/components/toast";
import cartController from "~/controllers/cart";
import productsController from "~/controllers/productsController";
import salesController from "~/controllers/sales";
import { CartInterface, ProductInterface } from "~/interfaces/interface";
import AttendantLayout from "~/layout/attendantLayout";

const Sales = () => {
    const { product, user, carts, totalQuantity, totalPrice } = useLoaderData<{
        product: ProductInterface[],
        user: { _id: string },
        carts: CartInterface[],
        totalQuantity: number,
        totalPrice: number
    }>();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSuppliers, setFilteredSuppliers] = useState(product);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false);
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
    const [dataValue, setDataValue] = useState<ProductInterface>();
    const [cartDataValue, setCartDataValue] = useState<CartInterface>();
    const [quantity, setQuantity] = useState(1);
    const [CartItemNewPrice, setCartItemNewPrice] = useState(0);
    const actionData = useActionData<any>();
    const submit = useSubmit();
    const [totalCost] = useState(totalPrice); // Fixed total cost
    const [amountPaid, setAmountPaid] = useState('');
    const [balance, setBalance] = useState(0);
    const [cartTotalPricePerItem] = useState();

    const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(true);


    const mm = carts.reduce((acc, cart) => {
        return acc + Number(cart.price); // Ensure quantity is treated as a number
    }, 0);

    const handleAmountPaidChange = (event: any) => {
        const paid = parseFloat(event.target.value) || 0;
        setAmountPaid(event.target.value);
        setBalance(totalCost - paid);
    };

    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpened(false);
    };
    const handleConfirmModalClosed = () => {
        setIsConfirmModalOpened(false);
    };

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
                successToast(actionData.message);
            } else {
                errorToast(actionData.message);
            }
        }
    }, [actionData]);

    const handleCheckout = (event: any) => {

    };

    // Function to generate receipt content
    const generateReceiptContent = () => {
        let receipt = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .receipt-container { padding: 20px; }
                        .receipt-header, .receipt-footer { text-align: center; }
                        .receipt-items { margin-top: 20px; }
                        .item { display: flex; justify-content: space-between; }
                        .total { font-weight: bold; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        <div class="receipt-header">
                            <h2>Receipt</h2>
                            <p>Thank you for your purchase!</p>
                        </div>
                        <div class="receipt-items">
        `;

        carts.forEach((cart) => {
            receipt += `
                <div class="item">
                    <span>${cart.product.name}</span>
                    <span>${cart.quantity} x ${cart.price} = Ghc ${cart.quantity * cart.price}</span>
                </div>
            `;
        });

        receipt += `
                </div>
                <div class="total">
                    <div class="item">
                        <span>Total Quantity</span>
                        <span>${totalQuantity}</span>
                    </div>
                    <div class="item">
                        <span>Total Amount</span>
                        <span>Ghc ${totalPrice}</span>
                    </div>
                    <div class="item">
                        <span>Amount Paid</span>
                        <span>Ghc ${amountPaid}</span>
                    </div>
                    <div class="item">
                        <span>Balance</span>
                        <span>Ghc ${balance}</span>
                    </div>
                </div>
                <div class="receipt-footer">
                    <p>Attendant: ${user.name}</p>
                    <p>Date: ${new Date().toLocaleString()}</p>
                </div>
            </div>
            </body>
        </html>
        `;

        return receipt;
    };




    return (
        <AttendantLayout pageName="Sales Point">
            <Toaster position="top-center" />
            <div className="lg:grid lg:grid-cols-3 gap-10 mt-6">
                <div className="col-span-2 h-[85vh]">
                    {/* search */}
                    <div>
                        <Input
                            placeholder="Search product..."
                            startContent={<SearchIcon className="" />}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            classNames={{
                                inputWrapper: "h-14 lg:w-80 bg-slate-900 border border-white/5 hover:bg-slate-800",
                            }}
                        />
                    </div>

                    {/* product items */}
                    <div className="mt-4 lg:grid lg:grid-cols-4 gap-10 overflow-y-scroll scrollbar-thin pr-8
                         h-[76vh] rounded-lg overflow-x-hidden">
                        {filteredSuppliers.map((products: ProductInterface, index: number) => (
                            <div className="lg:w-[13vw] rounded-lg p-2 lg:h-[30vh] mt-4 bg-slate-900 border border-white/5" key={index} onClick={() => {
                                setIsEditModalOpened(true);
                                setDataValue(products);
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
                {/* Items added to cart */}
                <Form method="post">
                    <div className="h-[85vh] border border-white/5 rounded-xl shadow-lg flex flex-col justify-between">
                        <div className="h-[53vh] overflow-y-scroll scrollbar-thin">
                            {/* added items come here */}
                            {carts.map((cart: CartInterface, index: number) => (
                                <div key={index} className="h-20 w-full bg-slate-900 border border-white/5 mt-4 rounded-lg p-2 flex gap-10">
                                    <div className="h-16 w-20">
                                        <img className="h-16 w-20 rounded-lg" src={cart?.product?.image} alt="" />
                                    </div>
                                    <div className="flex flex-col justify-between w-full">
                                        <div>
                                            <div className="flex justify-between">
                                                <p className="font-poppins text-lg">{cart?.product?.name}</p>
                                                <button className="text-danger" type="button" onClick={() => {
                                                    setIsConfirmModalOpened(true);
                                                    setCartDataValue(cart);
                                                }}><DeleteIcon /></button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="font-poppins text-sm">
                                                {cart?.quantity === 1 ? `${cart.quantity} item` : `${cart.quantity} items`}
                                            </p>
                                            <p className="font-poppins text-md">Ghc {cart?.price}</p>
                                        </div>
                                    </div>
                                    <input name="quantity" type="hidden" value={cart.quantity} />
                                    <input name="product" type="hidden" value={cart.product._id} />
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-900 border border-white/5 h-60 flex flex-col justify-between rounded-xl px-10 py-4 text-white">
                            <div>
                                <div className="flex justify-between">
                                    <p className="text-md font-poppins">Quantity</p>
                                    <p className="text-md font-poppins">{totalQuantity}</p>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <p className="text-md font-poppins">Total Amount</p>
                                    <p className="text-md font-poppins">Ghc {totalPrice}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    id="amountPaid"
                                    value={amountPaid}
                                    onChange={handleAmountPaidChange}
                                    name="amountPaid"
                                />
                                <Input
                                    id="balance"
                                    value={balance}
                                    readOnly
                                    name="balance"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                {isCheckoutDisabled ? (
                                    <>
                                        {
                                            carts.length === 0 ? (
                                                <>
                                                    <button className="w-80 h-14 bg-danger rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-danger font-poppins text-xl" color="primary" onClick={(e: any) => {
                                                        e.preventDefault()
                                                    }}     >
                                                        No cart item found
                                                    </button>
                                                </>) : (<>
                                                    <button className="w-80 h-14 bg-success rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-success font-poppins text-xl" color="primary" type="submit" onClick={(event: any) => {
                                                        event.preventDefault()
                                                        const receiptContent = generateReceiptContent();

                                                        // Open a new window for the receipt
                                                        const printWindow = window.open('', '_blank', 'width=800,height=600');
                                                        printWindow?.document.write(receiptContent);
                                                        printWindow?.document.close();
                                                        printWindow?.print();
                                                        setIsCheckoutDisabled(false);

                                                    }}  >
                                                        Print Receipt
                                                    </button></>)
                                        }
                                    </>
                                ) : (
                                    <>
                                        <button className="w-80 h-14 bg-primary rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-primary font-poppins text-xl" color="primary" type="submit">
                                            Checkout
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                        <input type="hidden" name="attendant" value={user._id} />
                        <input type="hidden" name="intent" value="addCartToSales" />
                        <input type="hidden" name="totalAmount" value={totalPrice} />
                    </div>
                </Form>
            </div>
            <ConfirmModal header="Confirm Remove" content="Are you sure to remove item from cart? " isOpen={isConfirmModalOpened} onOpenChange={handleConfirmModalClosed}>
                <div className="flex gap-4">
                    <Button color="primary" variant="flat" className="font-poppins text-md" onPress={handleConfirmModalClosed}>
                        No
                    </Button>
                    <Button color="danger" variant="flat" className="font-poppins text-md" onClick={() => {
                        setIsConfirmModalOpened(false);
                        if (cartDataValue) {
                            submit({
                                intent: "delete",
                                id: cartDataValue?._id
                            }, {
                                method: "post"
                            });
                        }
                    }}>
                        Yes
                    </Button>
                </div>
            </ConfirmModal>

            <EditModal modalTitle="" className="bg-slate-800" onOpenChange={handleEditModalClose} isOpen={isEditModalOpened}>
                {(onClose) => (
                    <Form method="post">
                        <div className="flex flex-col justify-center">
                            <input type="hidden" name="quantity" value={quantity} />
                            <input type="hidden" name="attendant" value={user?._id} />
                            <input type="hidden" name="product" value={dataValue?._id} />
                            <input type="hidden" name="price" value={dataValue?.price * quantity} />
                            <input type="hidden" name="intent" value="addToCart" />
                            <p className="text-4xl font-poppins">{dataValue?.name}</p>
                            <p className="text-2xl font-poppins mt-4">GHC {dataValue?.price}</p>
                        </div>
                        <div className="flex justify-start gap-8 mt-10 font-poppins">
                            <Button color="danger" className="h-20" variant="flat" onClick={() => {
                                setQuantity(quantity - 1);
                            }}>
                                Close
                            </Button>
                            <div className="flex items-center justify-center">
                                <p>{quantity}</p>
                            </div>
                            <Button color="success" className="h-20" variant="flat" onClick={() => {
                                setQuantity(quantity + 1);
                            }}>
                                <PlusIcon className="h-60 w-60" />
                            </Button>
                        </div>
                        <button className="mt-10 bg-primary rounded-xl flex items-center justify-center gap-2 bg-opacity-20 text-primary h-16 w-60 font-poppins text-xl" onClick={() => {
                            setCartItemNewPrice(quantity * dataValue?.price);
                            setIsEditModalOpened(false);
                        }}>
                            <CartIcon className="h-6 w-6" /> Add To Cart
                        </button>
                    </Form>
                )}
            </EditModal>
        </AttendantLayout>
    );
};

export default Sales;

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const quantity = formData.get("quantity") as string;
    const product = formData.get("product") as string;
    const attendant = formData.get("attendant") as string;
    const price = formData.get("price") as string;
    const intent = formData.get("intent") as string;
    const id = formData.get("id") as string;
    const balance = formData.get("balance") as string;
    const amountPaid = formData.get("amountPaid") as string;
    const totalAmount = formData.get("totalAmount") as string;

    switch (intent) {
        case "addToCart":
            const cart = await cartController.AddToCart({
                request,
                intent,
                quantity,
                product,
                attendant,
                price,
            });
            return cart;

        case "addCartToSales":
            const addSales = await salesController.AddCartToSales({
                intent,
                request,
                product,
                attendant,
                quantity,
                totalAmount,
                amountPaid,
                balance,
            });
            return addSales;

        case "delete":
            const deleteItem = await cartController.DeleteItem({ id, intent, product, quantity });
            return deleteItem;
        default:
            break;
    }
};

export const loader: LoaderFunction = async ({ request }) => {
    const { product, user } = await productsController.ProductFetch(request);

    const { carts, totalQuantity, totalPrice } = await cartController.FetchCart(request);

    return { product, user, carts, totalQuantity, totalPrice };
};
