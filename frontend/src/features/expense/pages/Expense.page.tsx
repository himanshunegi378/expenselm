import { useMemo, useState } from 'react';
import { Navigate, Outlet, useNavigate, useOutlet, useParams } from 'react-router-dom';
import { PlusIcon, Edit, Trash2 } from 'lucide-react';

import { AlertBox } from '../../../shared/ui';
import { useGetAllExpenses } from '../hooks/useGetAllExpenses';
import { useDeleteExpense } from '../hooks/useDeleteExpense';
import { Category } from '../components/Category';
import { DateNavigator } from '../ui/DateNavigator';
import type { Expense } from '../types/expense.types';
import { format } from 'date-fns';

// *******************************************************************
// 1. Dedicated, Responsive ExpenseItem Component (Card UI)
// *******************************************************************
interface ExpenseItemProps {
    expense: Expense;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

const ExpenseItem = ({ expense, onEdit, onDelete, isDeleting }: ExpenseItemProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col space-y-3 transition-all hover:shadow-lg">
            {/* --- Top Section: Category and Amount --- */}
            <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                    <Category categoryId={expense.categoryId} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {expense.description}
                    </p>
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200 flex-shrink-0">
                    ${Number(expense.amount).toFixed(2)}
                </p>
            </div>

            {/* --- Notes Section (Optional) --- */}
            {expense.notes && (
                <p className="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                    {expense.notes}
                </p>
            )}

            {/* --- Actions --- */}
            <div className="flex justify-end items-center gap-2 pt-2">
                <button
                    onClick={() => onEdit(expense.id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                    <Edit size={16} />
                    <span>Edit</span>
                </button>
                <button
                    onClick={() => onDelete(expense.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Trash2 size={16} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
            </div>
        </div>
    );
};


// *******************************************************************
// 2. Main ExpensePage Component (Refactored)
// *******************************************************************
export const ExpensePage = ({ date }: { date: string }) => {
    const navigate = useNavigate();

    // Hooks remain the same
    const { expenses, isLoading, isError, error } = useGetAllExpenses(); // Assuming this hook filters by date or you do it client-side
    const { deleteExpense } = useDeleteExpense();

    const [rowState, setRowState] = useState<{ [key: string]: 'idle' | 'deleting' }>({});

    const handleDateChange = (isoDateString: string) => {
        // convert isoDateString to yyy-MM-dd
        const date = format(isoDateString, 'yyyy-MM-dd');
        navigate(`/expense/${date}`);
    };

    const handleDelete = (id: string) => {
        setRowState((prev) => ({ ...prev, [id]: 'deleting' }));
        deleteExpense(id, {
            onSettled: () => {
                setRowState((prev) => ({ ...prev, [id]: 'idle' }));
            },
        });
    };

    const handleEdit = (id: string) => {
        navigate(`/expense/update/${id}`);
    };

    // Filter expenses based on the selected date (client-side example)
    // For performance, it's better to fetch filtered data from the server
    const filteredExpenses = useMemo(() => {


        return expenses?.filter(expense => {
            const expenseDate = new Date(expense.date).toDateString();
            const selected = new Date(date).toDateString();
            return expenseDate === selected;
        }) ?? [];
    }, [expenses, date]);


    return (
        // Use padding `p-4` for mobile and increase it for larger screens `md:p-6`
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expense Tracker</h1>
            </header>

            <div className="mb-6 space-y-4">
                <DateNavigator value={date} onChange={handleDateChange} />
                <Outlet />
            </div>

            {isError && <AlertBox type="error" message={error?.message || 'Something went wrong'} />}

            {/* --- Responsive Expense List --- */}
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Loading expenses...</p>
                ) : filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                        <ExpenseItem
                            key={expense.id}
                            expense={expense}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={rowState[expense.id] === 'deleting'}
                        />
                    ))
                ) : (
                    // 4. Clearer Empty State
                    <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Expenses Found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Add a new expense for this date using the plus button.
                        </p>
                    </div>
                )}
            </div>

            {/* --- 3. Improved Floating Action Button (FAB) --- */}
            <button
                onClick={() => navigate(`add`)}
                className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-transform hover:scale-110"
                aria-label="Add new expense"
            >
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

const isValidDate = (dateString?: string) => {
    if (!dateString) {
        return false;
    }
    // check if format is yyyy-MM-dd
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    return true;
};
export const ExpensePageWrapper = () => {
    const { date } = useParams<{ date: string }>(); // date in fromat yyyy-MM-dd
    if (!date || !isValidDate(date)) {
        const date = format(new Date(), 'yyyy-MM-dd');
        return <Navigate to={`/expense/${date}`} replace />;
    }

    return <ExpensePage date={date} />;
};