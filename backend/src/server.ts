
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 3000;

const app = express();

app.use("/health", (_, res) => {
    res.json({
        success: true,
        message: "Server is running"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


