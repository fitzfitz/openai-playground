const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const generateAnswer = async (req, res) => {
  const { question } = req.query;
  const prompt = question || "";

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).json({ result: completion?.data?.choices?.[0]?.text });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error please contact admin",
    });
  }
};

module.exports = {
  generateAnswer,
};
