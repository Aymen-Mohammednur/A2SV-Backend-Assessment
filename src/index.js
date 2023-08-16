const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
require("dotenv").config();

const cors = require("cors");
app.use(cors());

// importing routes
const authRoute = require("./routes/auth-route");
const taskRoute = require("./routes/task-route");
const projectRoute = require("./routes/project-route");

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);
app.use("/api/project", projectRoute);

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME;
const DB_URL = `${process.env.DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

// connecting to database
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.info("Database connected successfully");
});

app.listen(PORT, () => {
    console.info(`Server is listening at http://localhost:${PORT}`);
    console.info("Connecting to database...");
});