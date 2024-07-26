export const CategoryColumns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "action", label: "Action" },
];

export const ProductColumns = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "costPrice", label: "Cost Price" },
    { key: "price", label: "Selling Price" },
    { key: "quantity", label: "Quantity" },
    { key: "low_stock", label: "Low Stock" },
    {key:"action", label: "Action"}
]
export const UserColumns = [
    {title:"Name", allowSort:true },
    {title:"Password", allowSort:true },
    { title:"Phone", allowSort:true },
    { title:"Role", allowSort:true },
    {title:"Action", allowSort:true}
]
export const SuppliersColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {key:"action", label: "Action"}
]
export const SalesColumns = [
    { key: "Receipt ID", label: "Receipt ID" },
    { key: "attendant", label: "Attendant" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "amountPaid", label: "Amount Paid" },
    { key: "balance", label: "Balance" },
    {key:"action", label: "Action"}
]
export const AdminDashboardSalesColumns = [
    { key: "products", label: "Products" },
    { key: "quantity", label: "Quantity" },
    { key: "attendant", label: "Attendant" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "amountPaid", label: "Amount Paid" },
    { key: "balance", label: "Balance" },
    {key:"action", label: "Action"}
]
