import { ReactNode, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, Pagination } from "@nextui-org/react";

interface Column {
    key: string;
    label: ReactNode;
}

interface CustomTableProps {
    columns: Column[];
    children: ReactNode[];
    rowsPerPage: number;
    onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export default function CustomTable({ columns, children, rowsPerPage, onRowsPerPageChange }: CustomTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(children.length / rowsPerPage);
    const currentData = children.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="z-0">
            <Table className="mt-6 " aria-label="Example table with custom cells"
                classNames={{
                    base: ` h-[65vh]  w-screen md:w-full  shadow-none`,
                    wrapper:
                        "dark:bg-slate-900 vertical-scrollbar horizontal-scrollbar shadow-none bg-white rounded-2xl dark:border border-white/5",
                    th: "dark:bg-slate-800",
                    td: "font-nunito text-xs text-slate-500 dark:text-slate-200 ",
                }}
            >
                <TableHeader className="" columns={columns}>
                    {(column) => (
                        <TableColumn className="" key={column.key}>{column.label}</TableColumn>
                    )}
                </TableHeader>
                <TableBody className="bg-primary">
                    {currentData}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    className="font-poppins"
                    total={totalPages}
                    initialPage={1}
                    onChange={(page) => handlePageChange(page)}
                    currentPage={currentPage}
                />
                <div className="font-nunito text-md">
                    Rows per page:
                    <select
                        className="rounded-lg outline-none w-12 p-1 text-white bg-primary"
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={13}>13</option>

                    </select>
                </div>
            </div>
        </div>
    );
}
