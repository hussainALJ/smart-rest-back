import express from "express";

const authRoutes = express.Router();

authRoutes.get("/api/auth/login", login)