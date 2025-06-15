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
const likelyCategory_1 = require("../likelyCategory");
describe('categorySelection', () => {
    const categories = [
        { id: '1', name: 'Food' },
        { id: '2', name: 'Travel' },
        { id: '3', name: 'Utilities' },
        { id: '4', name: 'Shopping' },
        { id: '5', name: 'Health' },
        { id: '6', name: 'Other' }
    ];
    it('should select the correct category based on description', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, likelyCategory_1.likelyCategory)({
            description: 'Bought groceries at Walmart',
            notes: '',
            categories
        });
        // Accepts 'Food' as correct answer for this test
        expect(result).toContainEqual({ id: '1', name: 'Food' });
    }));
    it('should select the correct category based on notes', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, likelyCategory_1.likelyCategory)({
            description: 'Paid bill',
            notes: 'Electricity for April',
            categories
        });
        expect(result).toContainEqual({ id: '3', name: 'Utilities' });
    }));
    it('should return Other if nothing matches', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, likelyCategory_1.likelyCategory)({
            description: 'Random expense',
            notes: '',
            categories
        });
        expect(result).toContainEqual({ id: '6', name: 'Other' });
    }));
    it('should handle empty description and notes', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, likelyCategory_1.likelyCategory)({
            description: '',
            notes: '',
            categories
        });
        // expect empty array
        expect(result).toStrictEqual([]);
    }));
    it('should handle empty categories array', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, likelyCategory_1.likelyCategory)({
            description: 'Bought medicine',
            notes: '',
            categories: []
        });
        expect(result).toStrictEqual([]);
    }));
});
