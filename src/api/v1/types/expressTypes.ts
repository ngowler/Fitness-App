import { Request, Response, NextFunction } from "express";

export type MiddlewareFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

export type RequestBody = Record<string, unknown>;

export type RequestData<T extends RequestBody = RequestBody> = {
    body: T;
    params: Record<string, string>;
    query: Record<string, string | string[]>;
};
