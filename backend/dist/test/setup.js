"use strict";
// This file will run before all tests
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaTest = void 0;
// Import the singleton prisma instance
const dotenv_1 = __importDefault(require("dotenv"));
// Set NODE_ENV explicitly for tests
process.env.NODE_ENV = 'test';
// Load environment variables
dotenv_1.default.config({ path: '.env.test' });
const prisma_1 = require("../core/db/prisma");
// Use the singleton Prisma instance for testing
exports.prismaTest = prisma_1.prisma;
// Global setup
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Reset the database completely before all tests
    yield clearDatabase();
}));
// Clean up after all tests are done
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Disconnect the Prisma client
    yield exports.prismaTest.$disconnect();
}));
// Helper function to clear the database
function clearDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Use $transaction to ensure atomicity
        yield exports.prismaTest.$transaction([
            // Order matters due to foreign key constraints
            exports.prismaTest.expense.deleteMany(),
            exports.prismaTest.category.deleteMany(),
            exports.prismaTest.user.deleteMany(),
        ]);
    });
}
// Don't reset tables between each test as it disrupts test flows
// Tests should be written to be independent or to set up their own state
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // We could clear data between tests, but for auth tests we want to preserve users
    // created in beforeAll blocks
    // Instead of clearing all data, we'll let each test manage its own state
    // This ensures test fixtures created in beforeAll blocks remain available
}));
