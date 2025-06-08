import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { AlertBox } from '../../../shared/ui';
import AddExpenseForm from '../components/AddExpense/AddExpenseForm';
import { useGetAllExpenses } from '../hooks/useGetAllExpenses';
import type { Expense } from '../types/expense.types';
import { DateNavigator } from '../ui/DateNavigator';
import { Category } from '../components/Category';
import { useDeleteExpense } from '../hooks/useDeleteExpense';


const columnHelper = createColumnHelper<Expense>()







export const ExpensePage = () => {
    const { expenses, isLoading, isError, error, refetch } = useGetAllExpenses()
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
    const { deleteExpense } = useDeleteExpense()
    const [rowstate, setRowState] = useState<{
        [key: string]: 'idle' | 'deleting'
    }>({})


    const columns = useMemo(() => [
        columnHelper.accessor('amount', {
            header: 'Amount',
            cell: ({ row, table, cell, getValue }) => getValue()
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: ({ row, table, cell, getValue }) => getValue()
        }),
        columnHelper.accessor('categoryId', {
            header: 'Category',
            cell: ({ row, table, cell, getValue }) => <Category categoryId={getValue()} />
        }),
        columnHelper.accessor('notes', {
            header: 'Notes',
            cell: ({ row, table, cell, getValue }) => getValue()
        }),
        columnHelper.accessor('actions', {
            header: 'Actions',
            cell: ({ row, table, cell, getValue }) => (
                <div className="flex gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50" disabled={rowstate[row.original.id] === 'deleting'} onClick={() => {
                        setRowState((prev) => ({
                            ...prev,
                            [row.original.id]: 'deleting'
                        }))
                        deleteExpense(row.original.id, {
                            onSettled: () => {
                                setRowState((prev) => ({
                                    ...prev,
                                    [row.original.id]: 'idle'
                                }))
                            }
                        })
                    }}>Delete</button>
                </div>
            )
        }),
    ], [columnHelper, deleteExpense, rowstate])

    const table = useReactTable({
        data: expenses,
        columns,
        meta: {
            selectedDate,
        },
        getCoreRowModel: getCoreRowModel()
    })

    const handleDateChange = (isoDateString: string) => {
        console.log('Selected date:', isoDateString);
        // Here you can fetch expenses for the selected date
        // Example: fetchExpensesForDate(isoDateString);
        setSelectedDate(isoDateString);
    };


    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
            <div className="mb-6 space-y-4">
                <DateNavigator
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <AddExpenseForm date={selectedDate} onSuccess={() => refetch()} />
            </div>
            {isError && <AlertBox type="error" message={error?.message || 'Something went wrong'} />}
            <div>
                <table className={`w-full border-collapse border border-gray-300 ${isLoading ? 'opacity-50' : ''}`}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className='border border-gray-300 p-2 text-left'>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className='border border-gray-300 p-2'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

