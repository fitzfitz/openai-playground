const express = require("express");
const router = express.Router();
const {
  generateAnswer,
  generateImage,
} = require("../controller/openAiControllers");

router.post("/", generateAnswer);
router.post("/generate-image", generateImage);

module.exports = router;
