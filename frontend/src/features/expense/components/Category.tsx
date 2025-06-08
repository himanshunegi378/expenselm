import React from 'react';
import { useGetAllCategories } from '../hooks/useGetAllCategories';

interface CategoryProps {
  categoryId: string | null;
}

export const Category: React.FC<CategoryProps> = ({ categoryId }) => {
  const { categories, isLoading } = useGetAllCategories();
  
  if (!categoryId) return null;
  if (isLoading) return <span className="text-gray-400">Loading...</span>;
  
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) return <span className="text-gray-400">Unknown category</span>;
  
  return <span>{category.name}</span>;
};
