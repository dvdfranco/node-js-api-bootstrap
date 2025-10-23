import { User, Prisma } from "@prisma/client";
import prismaClient from "../prisma";
import bcrypt from "bcrypt";

class UserService {
    async getAllUsers() {
        const users = await prismaClient.user.findMany();
        return { ok: true, users };
    }

    async createUser(data: Partial<User>, createdBy: string) {
        const dateNow = new Date().toISOString();

        //encrypt!
        const cryptPwd = await bcrypt.hash(data.password!, 10);

        const createData: Prisma.UserCreateInput = {
            username: data.username!,
            email: data.email!,
            name: data.name!,
            password: cryptPwd,
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

    async searchUserByUserName(username: string): Promise<User[]> {
        return await prismaClient.user.findMany({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                }
            }
        });
    }

    async authenticateUser(username: string, password: string): Promise<User | undefined> {
        const users = await this.searchUserByUserName(username);
        if (!users.length) return;
        
        const user = users[0];
        if (await bcrypt.compare(password, user.password))
            return user;
        return;
    }
}

export { UserService };