import { likelyCategory } from '../likelyCategory';

describe('categorySelection', () => {
    const categories = [
        { id: '1', name: 'Food' },
        { id: '2', name: 'Travel' },
        { id: '3', name: 'Utilities' },
        { id: '4', name: 'Shopping' },
        { id: '5', name: 'Health' },
        { id: '6', name: 'Other' }
    ];

    it('should select the correct category based on description', async () => {
        const result = await likelyCategory({
            description: 'Bought groceries at Walmart',
            notes: '',
            categories
        });
        // Accepts 'Food' as correct answer for this test
        expect(result).toContainEqual({ id: '1', name: 'Food' });
    });

    it('should select the correct category based on notes', async () => {
        const result = await likelyCategory({
            description: 'Paid bill',
            notes: 'Electricity for April',
            categories
        });
        expect(result).toContainEqual({ id: '3', name: 'Utilities' });
    });

    it('should return Other if nothing matches', async () => {
        const result = await likelyCategory({
            description: 'Random expense',
            notes: '',
            categories
        });
        expect(result).toContainEqual({ id: '6', name: 'Other' });
    });

    it('should handle empty description and notes', async () => {
        const result = await likelyCategory({
            description: '',
            notes: '',
            categories
        });
        // expect empty array
        expect(result).toStrictEqual([]);
    });

    it('should handle empty categories array', async () => {
        const result = await likelyCategory({
            description: 'Bought medicine',
            notes: '',
            categories: []
        })
        expect(result).toStrictEqual([]);
    });
});
