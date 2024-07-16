import express, { json } from 'express';
import dotenv from 'dotenv';
import userRoute from './Routes/userRoutes.js';

const app = express();
dotenv.config();
app.use(json());
app.use("/api/user",userRoute);

export default app;
