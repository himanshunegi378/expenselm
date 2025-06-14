import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from '@langchain/openai'


const llm = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.1
})

/**
 * Based on description and notest suggest most likely category
 */
export const likelyCategory = async ({
    description,
    notes,
    categories
}: {
    description?: string;
    notes?: string | null;
    categories: { id: string, name: string }[];
}) => {
    const categoryLLm = llm.withStructuredOutput(z.object({
        categories: z.array(z.object({
            id: z.string(),
            name: z.string()
        }))
    }))

    const result = await categoryLLm.invoke([
        {
            role: 'system',
            content: `You are an expert text categorizer. 
            Your task is to analyze the provided text and provide an ordered
            list of categories, from most likely to least likely, that the text belongs to.
            max 3 categories
            If no categories are provided return an empty array.
            If the text is not related to any of the categories, return an empty array.`
        },
        {
            role: 'user',
            content: `Description: ${description || ''}
            
            Notes: ${notes || ''}

            Categories: ${categories.map(category => `id: ${category.id}, name: ${category.name}`).join('\n')}`
        }
    ])

    return result.categories
}