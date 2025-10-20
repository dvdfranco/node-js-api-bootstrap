import { Category, Prisma } from "@prisma/client";
import prismaClient from "../prisma";

class CategoryService {
    async getAllCategories() {
        const categories = await prismaClient.category.findMany();
        return { ok: true, categories };
    }

    async updateCategory(categoryId: string, data: Partial<Category>) {
        const updateData: Prisma.CategoryUpdateInput = {
            name: data.name,
            autocomplete: data.autocomplete,
            icon: data.icon,
            color: data.color,
        };

        return await prismaClient.category.update({
            where: { id: categoryId },
            data: updateData
        });
    }

    async searchCategoryByName(name: string) {
        return await prismaClient.category.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive"
                }
            }
        });
    }
}

export { CategoryService };