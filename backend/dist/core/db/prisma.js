"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("./generated/client");
// Create a singleton Prisma client instance
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};
const globalForPrisma = globalThis;
// Ensure we don't create multiple instances in dev due to hot reloading
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
