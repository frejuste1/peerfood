import { Router } from 'express';
import CheckOut from "../Controllers/CheckOut.js";

const CheckOutRouter = Router();

CheckOutRouter
   .get(
        '/',
        CheckOut.getAll
    )
   .post(
        '/',
        CheckOut.create
    )
   .get(
        '/:id',
        CheckOut.getById
    );

export default CheckOutRouter;