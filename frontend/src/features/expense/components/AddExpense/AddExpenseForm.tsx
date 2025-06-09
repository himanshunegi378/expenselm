import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { AlertBox, FormContainer, FormInput, FormTextArea, SubmitButton } from "../../../../shared/ui";
import { useCreateExpense } from "../../hooks/useCreateExpense";
import { expenseFormSchema } from "../../validations/expense.validations";
import { CategorySelect } from "../CategorySelect";
import type { Expense } from "../../types/expense.types";
import { useUpdateExpense } from "../../hooks/useUpdateExpense";

// --- PROPS ---
// This is a discriminated union. It ensures that you can either pass
// 'initialData' (for updating an expense) or a 'date' (for creating a new one), but not both.
type ExpenseProps = {
    onSuccess: () => void;
    submitLabel: string;
    title: string;
} & ({
    initialData: Expense;
    date?: never;
} | {
    initialData?: never;
    date: string; // ISO date string YYYY-MM-DD
});


const AddExpenseForm = ({
    initialData,
    date,
    onSuccess,
    submitLabel,
    title
}: ExpenseProps) => {
    const { createExpense, isLoading: isCreating, isError, error, isSuccess } = useCreateExpense()
    const { updateExpense, isLoading: isUpdating } = useUpdateExpense()

    const isLoading = isCreating || isUpdating;

    const form = useForm<z.infer<typeof expenseFormSchema>>(
        {
            // Set default values based on whether we're creating or updating
            defaultValues: initialData ? {
                ...initialData,
                amount: String(initialData.amount), // Ensure amount is a string for the form input
            } : {
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
            if (initialData) {
                // We are updating an existing expense
                await updateExpense({ id: initialData.id, data }, {
                    onSuccess: () => onSuccess(),
                });
            } else {
                // We are creating a new expense
                await createExpense(data, {
                    onSuccess: () => onSuccess(),
                });
            }
        } catch (error) {
            // Error handling can be enhanced here if needed
            console.error(error);
        }
    };

    return (
        <FormContainer title={title}>
            {/* General form error/success messages */}
            {isError && <AlertBox type="error" message={error?.message || 'Something went wrong'} />}
            {isSuccess && !initialData && <AlertBox type="success" message="Expense added successfully" />}

            {/*
              MOBILE-FIRST IMPROVEMENT:
              - `noValidate` prevents default browser validation UI.
              - `flex flex-col gap-6` creates a clean, vertical rhythm with generous spacing, ideal for mobile.
            */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>

                {/*
                  MOBILE-FIRST IMPROVEMENT: "Amount" Field
                  - A `relative` container allows for an inner currency symbol.
                  - The `span` is the currency symbol, styled to appear inside the input.
                  - The input has left padding (`pl-8`) to not overlap with the symbol.
                  - `inputMode="decimal"` brings up the correct numeric keyboard on mobile devices.
                */}
                <div className="relative">
                    <FormInput
                        id="amount"
                        label="Amount"
                        type="number"
                        placeholder="0.00"
                        register={form.register}
                        name="amount"
                        error={form.formState.errors.amount}
                        className="text-lg"
                        // Pass additional props to the underlying input element
                        inputProps={{
                            inputMode: "decimal",
                            step: "0.01"
                        }}
                    />
                </div>


                <FormInput
                    id="description"
                    label="Description"
                    type="text"
                    placeholder="e.g., Coffee with team"
                    register={form.register}
                    name="description"
                    error={form.formState.errors.description}
                />

                {/* Category Select - now with consistent labeling */}
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
                                onChange={field.onChange} // Simplified onChange handler
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

                {/*
                  MOBILE-FIRST IMPROVEMENT:
                  - The submit button is wrapped in a div with top padding for separation.
                  - `w-full` makes the button a large, easy-to-tap target on mobile.
                */}
                <div className="pt-2">
                    <SubmitButton
                        isLoading={isLoading}
                        loadingText={initialData ? "Saving..." : "Adding..."}
                        text={submitLabel}
                        className="w-full"
                    />
                </div>
            </form>
        </FormContainer>
    );
};

export default AddExpenseForm;