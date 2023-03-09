const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const generateAnswer = async (req, res) => {
  const chats = req.body.chats;
  const openingPrompt =
    "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.";
  const prompt = chats
    .map(
      (chat) => `${chat.user === "AI" ? "Fitz" : chat.user}: ${chat.message}`
    )
    .join(" ");

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      // prompt: `${openingPrompt}\n${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      stop: [" HUMAN:", " Fitz:"],
      // best_of: 1,
      // echo: true,
    });
    res.status(200).json({ result: completion?.data?.choices?.[0]?.text });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error please contact admin",
    });
  }
};

const generateImage = async (req, res) => {
  res
    .status(200)
    .json({ result: { generated: false, message: "Under Maintenance" } });

  // try {
  //   const completion = await openai.createImageVariation({
  //     model: "text-davinci-003",
  //     prompt: "",
  //     temperature: 0,
  //     max_tokens: 3000,
  //     top_p: 1,
  //     frequency_penalty: 0.5,
  //     presence_penalty: 0,
  //     stop: [" HUMAN:", " AI:"],
  //     // best_of: 1,
  //     // echo: true,
  //   });
  //   res.status(200).json({ result: completion?.data?.choices?.[0]?.text });
  // } catch (error) {
  //   res.status(400).json({
  //     success: false,
  //     error: "Error please contact admin",
  //   });
  // }
};

module.exports = {
  generateAnswer,
  generateImage,
};
