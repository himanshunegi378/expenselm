import { useState } from 'react';
import { createFilter } from 'react-select';
import Creatable from 'react-select/creatable';
import { toast } from 'sonner';
import { useGetAllCategoriesOrderedByLikeliness } from '../hooks/useGetAllCategoriesOrderedByLikeliness';
import { useCreateCategory } from '../hooks/useCreateCategory';

export interface CategoryOption {
    value: string;
    label: string;
    __isNew__?: boolean;
}

interface CreateCategoryInput {
    name: string;
}

interface CategorySelectProps {
    value: string | null; // Category ID
    onChange: (value: string | null) => void;
    placeholder?: string;
    description?: string;
    notes?: string;
}

export const CategorySelect = ({
    value,
    description = '',
    notes = '',
    onChange,
    placeholder = 'Select or create a category...'
}: CategorySelectProps) => {
    const [isCreating, setIsCreating] = useState(false);

    const { categories, isLoading: isLoadingCategories, refetch } = useGetAllCategoriesOrderedByLikeliness({ description, notes });
    const { createCategory } = useCreateCategory();

    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: category.name
    }));

    const handleCreateCategory = async (inputValue: string): Promise<CategoryOption | null> => {
        try {
            setIsCreating(true);
            const categoryData: CreateCategoryInput = {
                name: inputValue,
            };

            // Cast the response to the expected type
            const newCategory = await createCategory(categoryData);

            const newOption: CategoryOption = {
                value: newCategory.id,
                label: newCategory.name
            };

            toast.success(`Category "${newCategory.name}" created successfully`);
            refetch();
            return newOption;
        } catch (error) {
            toast.error('Failed to create category');
            console.error('Error creating category:', error);
            return null;
        } finally {
            setIsCreating(false);
        }
    };

    const handleChange = (newValue: CategoryOption | null) => {
        onChange(newValue?.value || null);
    };

    const handleCreate = async (inputValue: string) => {

        const createdCategory = await handleCreateCategory(inputValue);
        if (createdCategory) {
            onChange(createdCategory.value || null);
        }
    };

    const customStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: '40px',
            borderRadius: '0.375rem',
            borderColor: '#d1d5db',
            '&:hover': {
                borderColor: '#9ca3af',
            },
        }),
    };

    return (
        <div className="w-full">
            <Creatable
                value={categoryOptions.find(option => option.value === value)}
                onChange={handleChange}
                options={categoryOptions}
                isClearable
                isSearchable
                isOptionDisabled={() => isCreating}
                isLoading={isLoadingCategories || isCreating}
                placeholder={placeholder}
                noOptionsMessage={({ inputValue }: { inputValue: string }) =>
                    inputValue ? `No categories found. Press Enter to create "${inputValue}"` : 'No categories available'
                }
                loadingMessage={() => 'Loading categories...'}
                styles={customStyles}
                className="react-select-container"
                classNamePrefix="react-select"
                onCreateOption={handleCreate}
                filterOption={createFilter({
                    matchFrom: 'start',
                    stringify: (option: any) => option.data.label,
                })}
                formatCreateLabel={(inputValue: string) => `Create "${inputValue}"`}
                formatOptionLabel={(option: CategoryOption) => option.label}
                menuIsOpen={isLoadingCategories ? false : undefined}
            />
        </div>
    );
};



