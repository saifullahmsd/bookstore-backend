require("dotenv").config();
const env = require("../config/validateEnv");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("../config/db");
const errorHandler = require("../middlewares/error.middleware");


const app = express();
const PORT = env.PORT || 5000;

connectDB();

// 1. Logger
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 2. Rate Limiting (Global)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(cors({
    origin: ["http://localhost:5173", "https://your-frontend-app.vercel.app"], // Array mein URLs dein
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use("/api/books", require("../routes/book.routes"));
app.use("/api/users", require("../routes/user.routes"));

app.get('/', (req, res) => {
    res.send('API is running successfully! 🚀');
});

app.use(errorHandler);



if (require.main === module) {
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
}

module.exports = app;

