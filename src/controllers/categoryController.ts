import { CategoryService } from "../services/CategoryService";
import { Request, Response } from "express";
import { Category } from "@prisma/client";
import express from 'express';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    const categoryService = new CategoryService();
    const result = await categoryService.getAllCategories();
    res.json(result);
}

export const updateCategory = async (req: express.Request, res: express.Response): Promise<void> => {
    const categoryService = new CategoryService();
    const updateData = req.body as Partial<Category>;

    await categoryService.updateCategory(req.params.id, updateData);
    
    res.json({ ok: true });
}

export const searchCategoryByName = async (req: Request, res: Response): Promise<void> => {
    const categoryService = new CategoryService();
    const name = req.query.name as string;
    const categories = await categoryService.searchCategoryByName(name);
    res.json({ ok: true, categories });
}