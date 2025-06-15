"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likelyCategory = void 0;
const zod_1 = require("zod");
const openai_1 = require("@langchain/openai");
const llm = new openai_1.ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    temperature: 0.1
});
/**
 * Based on description and notest suggest most likely category
 */
const likelyCategory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ description, notes, categories }) {
    const categoryLLm = llm.withStructuredOutput(zod_1.z.object({
        categories: zod_1.z.array(zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string()
        }))
    }));
    const result = yield categoryLLm.invoke([
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
    ]);
    return result.categories;
});
exports.likelyCategory = likelyCategory;
