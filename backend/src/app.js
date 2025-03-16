import express from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true 
}));

app.use(express.json({
    limit: "16kb" 
}));
app.use(express.urlencoded({
    extended: true, 
    limit: "16kb" 
}));
app.use(cookieParser());


//IMPORTING ROUTES
import HealthcheckRoute from './routes/healthcheck.routes.js'
import userRouter from './routes/user.routes.js'
import { errorHandler } from "./middlewares/error.middlewares.js";

//USING ROUTES
app.use("/api/v1/healthcheck", HealthcheckRoute);
app.use("/api/v1/users", userRouter);

app.use(errorHandler)
export { app };