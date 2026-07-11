const express = require("express");
const router = express.Router();
const { importCsv } = require("../controllers/csvController");

router.post("/import", importCsv);

module.exports = router;
