import { useNavigate, useParams } from "react-router-dom";
import { queryClient } from "../../../lib/react-query";
import { BottomSheet } from "../../../shared/ui";
import AddExpenseForm from "../components/AddExpense/AddExpenseForm";
import { useGetAllExpenses } from "../hooks/useGetAllExpenses";

export const AddExpensePage = () => {
    const navigate = useNavigate();
    const { date: selectedDate } = useParams<{ date: string }>();

    return (
        <BottomSheet isOpen={true} onClose={() => {
            navigate(`/expense/${selectedDate}`, {
                replace: true
            })
        }}>
            {selectedDate && <AddExpenseForm submitLabel="Add Expense" title="Add Expense" date={selectedDate} onSuccess={() => {
                queryClient.refetchQueries({
                    exact: true,
                    queryKey: useGetAllExpenses.queryKey
                })
                navigate(`/expense/${selectedDate}`)
            }} />}
        </BottomSheet>
    )
}