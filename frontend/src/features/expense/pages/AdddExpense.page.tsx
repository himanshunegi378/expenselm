import { useLocation, useNavigate } from "react-router-dom";
import { BottomSheet } from "../../../shared/ui"
import AddExpenseForm from "../components/AddExpense/AddExpenseForm";
import { queryClient } from "../../../lib/react-query";
import { useGetAllExpenses } from "../hooks/useGetAllExpenses";

export const AddExpensePage = () => {
    const navigate = useNavigate();
    const { search } = useLocation()
    const selectedDate = new URLSearchParams(search).get('date')



    return (
        <BottomSheet isOpen={true} onClose={() => {
            navigate('/expense', {
                replace: true
            })
        }}>
            {selectedDate && <AddExpenseForm submitLabel="Add Expense" title="Add Expense" date={selectedDate} onSuccess={() => {
                queryClient.refetchQueries({
                    exact: true,
                    queryKey: useGetAllExpenses.queryKey
                })
                navigate('/expense')
            }} />}
        </BottomSheet>
    )
}