import { Router } from "express";
import Meal from "../Controllers/Plat.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import Security from "../Middlewares/RoleMiddleware.js";

const Plat = Router();

Plat
    .get(
        "/",
        Meal.getAll
    )
    .get(
        "/:id",
        Meal.getById
    )
    .get(
        "/total",
        Meal.getTotal
    )
    .get(
        '/:name',
        Meal.getOne
    )
    .post(
        "/",
        Meal.Create
    )
    .put(
        "/:id",
        Meal.Update
    )
    .delete(
        "/:id",
        Meal.Delete
    )

export default Plat;