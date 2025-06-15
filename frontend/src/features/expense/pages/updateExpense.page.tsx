import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BottomSheet } from "../../../shared/ui"
import AddExpenseForm from "../components/AddExpense/AddExpenseForm";
import { queryClient } from "../../../lib/react-query";
import { useGetAllExpenses } from "../hooks/useGetAllExpenses";
import { useGetExpenseById } from "../hooks/useGetExpenseById";

export const UpdateExpensePage = () => {
    const navigate = useNavigate();
    const { id, date } = useParams<{ id: string, date: string }>()
    const { expense, isLoading, isError, error } = useGetExpenseById(id)



    return (
        <BottomSheet isOpen={true} onClose={() => {
            navigate(`/expense/${date}`, {
                replace: true
            })
        }}>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error?.message}</p>}
            {expense && <AddExpenseForm submitLabel="Update Expense" title="Update Expense" initialData={expense} onSuccess={() => {
                queryClient.refetchQueries({
                    exact: true,
                    queryKey: useGetAllExpenses.queryKey
                })
                navigate(`/expense/${date}`)
            }} />}
        </BottomSheet>
    )
}