import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import colors from "colors";

dotenv.config();
colors.enable();

const app = express();

const corsOptions = {
	origin: "http://localhost:5173", // <-- if your frontend port is different, change it
	credentials: true,
	optionSuccessStatus: 200
};

// Middleware:
app.use(cors(corsOptions)); // <-- for CORS
app.use(cookieParser()); // <-- allows you to read req.cookies
app.use(express.json()); // <-- without this, req.body won't work (for JSON data being passed to the backend)
app.use(express.urlencoded({ extended: true })); // <-- without this, you won't be able to read form data

const PORT: string | number = process.env.PORT || 3000; // <-- if your port # is different, change it

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}!`.yellow.bold);
});
