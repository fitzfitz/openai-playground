const express = require("express");
const router = express.Router();
const {
  generateAnswer,
  generateImage,
  generateNames,
} = require("../controller/openAiControllers");

router.post("/", generateAnswer);
router.get("/generate-image", generateImage);
router.post("/generate-names", generateNames);

module.exports = router;
