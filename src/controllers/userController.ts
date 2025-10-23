import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { User } from "@prisma/client";
import express from 'express';
import { decrypt } from "../util/crypt";

const userService = new UserService();

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const result = await userService.getAllUsers();
    res.json(result);
}

export const createUser = async (req: express.Request, res: express.Response): Promise<void> => {
    const userService = new UserService();
    const createData = req.body as Partial<User>;

    await userService.createUser(createData, "User Id");

    res.json({ ok: true });
}

export const updateUser = async (req: express.Request, res: express.Response): Promise<void> => {
    const updateData = req.body as Partial<User>;
    const userId = decrypt(req.params['id']);

    await userService.updateUser(userId, updateData, "User Id");

    res.json({ ok: true });
}

export const deleteUser = async (req: express.Request, res: express.Response): Promise<void> => {
    const userId = decrypt(req.params['id']);

    await userService.deleteUser(userId);
    res.json({ ok: true });
}

export const searchByEmail = async (req: Request, res: Response): Promise<void> => {
    const email = req.query['email'] as string;
    const users = await userService.searchUserByEmail(email);
    res.json({ ok: true, users });
}