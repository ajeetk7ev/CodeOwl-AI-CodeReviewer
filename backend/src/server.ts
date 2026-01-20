
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {dbConnect} from './config/db';
import cookieParser from "cookie-parser";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";


const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use("/health", (_, res) => {
    res.json({
        success: true,
        message: "Server is running"
    })
})


app.listen(PORT, async() => {
    await dbConnect();
    console.log(`Server is running on port ${PORT}`);
});


