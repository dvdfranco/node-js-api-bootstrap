import { User, Prisma } from "@prisma/client";
import prismaClient from "../prisma";

class UserService {
    async getAllUsers() {
        const users = await prismaClient.user.findMany();
        return { ok: true, users };
    }
    async createUser(data: Partial<User>, createdBy: string) {
        const dateNow = new Date().toISOString();
        const createData: Prisma.UserCreateInput = {
            username: data.username!,
            email: data.email!,
            name: data.name!,
            password: data.password!,
            createdAt: dateNow,
            createdBy: createdBy,
            updatedAt: dateNow,
            updatedBy: createdBy
        };

        return await prismaClient.user.create({
            data: createData
        });
    }

    async updateUser(userId: string, data: Partial<User>, updatedBy: string) {
        const dateNow = new Date().toISOString();
        const updateData: Prisma.UserUpdateInput = {
            username: data.username,
            email: data.email,
            name: data.name,
            password: data.password,
            updatedAt: dateNow,
            updatedBy: updatedBy
        };

        return await prismaClient.user.update({
            where: { id: userId },
            data: updateData
        });
    }

    async deleteUser(userId: string) {
        return await prismaClient.user.delete({
            where: { id: userId }
        });
    }

    async searchUserByEmail(email: string) {
        return await prismaClient.user.findMany({
            where: {
                email: {
                    contains: email,
                    mode: "insensitive"
                }
            }
        });
    }

    async searchUserByUserName(username: string) {
        return await prismaClient.user.findMany({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        });
    }
}

export { UserService };