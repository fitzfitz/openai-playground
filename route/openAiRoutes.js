const express = require("express");
const router = express.Router();
const { generateAnswer } = require("../controller/openAiControllers");

router.get("/", generateAnswer);

module.exports = router;
