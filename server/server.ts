import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rootRouter from "./routes";

const app = express();
const PORT: number = Number(process.env.PORT) || 8000;

// Cors enabled for only frontend and production build URLs
const corsOptions = {
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use("/api/v1", rootRouter);

// Listen on the specified port
app.listen(PORT, () =>
  console.log(`App is running successfully on http://localhost:${PORT}`),
);
