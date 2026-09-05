import express from "express";
import helmet from "helmet";
import cors from "cors";
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
app.use("/api/v1", rootRouter);

// Redirect / to /api/v1
app.get("/", (req, res) => {
  res.redirect(307, "/api/v1");
});

// Listen on the specified port
app.listen(PORT, () =>
  console.log(`App is running successfully on http://localhost:${PORT}`),
);
