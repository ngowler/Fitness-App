import { Request, Response, NextFunction, RequestHandler  } from "express";
import { setCustomClaims } from "../src/api/v1/controllers/adminController";
import request from "supertest";
import app from "../src/app";

jest.mock("../src/api/v1/middleware/authorize", () =>
    jest.fn(({ hasRole }: { hasRole: string[] }): RequestHandler =>
        (req: Request, res: Response, next: NextFunction): void => {
            const userRole: string | string[] | undefined = req.headers["x-roles"];
            const userIdFromHeader: string | undefined = req.headers["x-uid"] as string;
            const userIdFromParams: string = req.params.uid;

            if (Array.isArray(userRole)) {
                if (userRole.some(role => hasRole.includes(role))) {
                    next();
                    return;
                }
            } else if (userRole && hasRole.includes(userRole)) {
                next();
                return;
            }

            if (userIdFromHeader && userIdFromHeader === userIdFromParams) {
                next();
                return;
            }

            res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
    )
);

jest.mock("../src/api/v1/middleware/authenticate", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
        if (!req.headers["authorization"]) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    })
);

jest.mock("../src/api/v1/controllers/adminController", () => ({
    setCustomClaims: jest.fn((req: Request, res: Response) => {
        res.status(200).json({ message: "Claims set successfully" });
    }),
}));

describe("/api/v1/admin/setCustomClaims Route", () => {
    it("should allow access for an admin user and call the controller", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .post("/api/v1/admin/setCustomClaims")
            .set("authorization", "Bearer token")
            .set("x-roles", "admin")
            .send({ uid: "123", claims: { role: "admin" }
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Claims set successfully");
        expect(setCustomClaims).toHaveBeenCalled();
    });

    it("should deny access if user lacks the admin role", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .post("/api/v1/admin/setCustomClaims")
            .set("authorization", "Bearer token")
            .set("x-roles", "user")
            .send({ uid: "123", claims: { role: "user" } });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe("Forbidden: Insufficient permissions");
        expect(setCustomClaims).not.toHaveBeenCalled();
    });

    it("should return an error if authentication fails", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .post("/api/v1/admin/setCustomClaims")
            .set("x-roles", "admin")
            .send({ uid: "123", claims: { role: "admin" } });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
        expect(setCustomClaims).not.toHaveBeenCalled();
    });

    it("should return an error if both authorization and roles headers are missing", async () => {
        // eslint-disable-next-line @typescript-eslint/typedef
        const response = await request(app)
            .post("/api/v1/admin/setCustomClaims")
            .send({ uid: "123", claims: { role: "user" } });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Unauthorized");
        expect(setCustomClaims).not.toHaveBeenCalled();
    });
});
