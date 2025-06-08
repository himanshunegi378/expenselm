import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AlertBox, FormContainer, FormInput, FormTextArea, SubmitButton } from "../../../../shared/ui";
import { useCreateExpense } from "../../hooks/useCreateExpense";
import { expenseFormSchema } from "../../validations/expense.validations";
import { CategorySelect } from "../CategorySelect";

const AddExpenseForm = ({
    date,
    onSuccess
}: {
    date: string //iso date string  yyyy-mm-dd;
    onSuccess: () => void
}) => {
    const { createExpense, isLoading, isError, error, isSuccess } = useCreateExpense()
    const form = useForm<z.infer<typeof expenseFormSchema>>(
        {
            defaultValues: {
                amount: '',
                description: '',
                categoryId: '',
                notes: '',
                date,
            },
            resolver: zodResolver(expenseFormSchema)
        }
    );

    const onSubmit = async (data: z.infer<typeof expenseFormSchema>) => {
        try {
            await createExpense(data,{
                onSuccess: () => {
                    onSuccess();
                    // form.reset();
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormContainer title="Add Expense">
            {isError && <AlertBox type="error" message={error?.message || 'Something went wrong'} />}
            {isSuccess && <AlertBox type="success" message="Expense added successfully" />}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    id="amount"
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    register={form.register}
                    name="amount"
                    error={form.formState.errors.amount}
                />

                <FormInput
                    id="description"
                    label="Description"
                    type="text"
                    placeholder="Expense description"
                    register={form.register}
                    name="description"
                    error={form.formState.errors.description}
                />

                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <Controller
                        name="categoryId"
                        control={form.control}
                        render={({ field }) => (
                            <CategorySelect
                                value={field.value}
                                onChange={(option) => {
                                    field.onChange(option);
                                }}
                                placeholder="Select or create a category..."
                            />
                        )}
                    />
                    {form.formState.errors.categoryId && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.categoryId.message}</p>
                    )}
                </div>

                <FormTextArea
                    id="notes"
                    label="Notes"
                    placeholder="Additional notes (optional)"
                    register={form.register}
                    name="notes"
                    error={form.formState.errors.notes}
                    rows={3}
                />

                <SubmitButton
                    isLoading={isLoading}
                    loadingText="Adding..."
                    text="Add Expense"
                    className="mt-4"
                />
            </form>
        </FormContainer>
    );
};

export default AddExpenseForm;