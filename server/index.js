require("dotenv").config();
const express = require("express");
const cors = require("cors");
const csvRoutes = require("./routes/csvRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/csv", csvRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
