const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const uuid = () => {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const strToJson = (jsonString) => {
  try {
    const res = JSON.parse(jsonString);
    return res;
  } catch (e) {
    return null;
  }
};

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
      model: "text-davinci-003",
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
  const prompt = req.query.criteria;

  if (!prompt || prompt === "") {
    res.status(400).json({ success: false, error: "No Criteria Found" });
  }
  try {
    const result = await openai.createImage({
      prompt,
      n: 1,
      size: "256x256",
    });
    res.status(200).json({ result: result.data.data[0].url });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Error please contact admin",
    });
  }
};

const generateNames = async (req, res) => {
  const { gender, origin, wordLength, meaning } = req.body;
  const MODEL = "gpt-3.5-turbo";

  const prompt = `Buat 3 nama anak bayi yang unik ${
    gender || ""
  } dan artinya. ${
    wordLength ? "Nama mengandung " + wordLength + " kata." : ""
  } ${origin ? "Nama dalam bahasa " + origin + "." : ""} ${
    meaning ? "Nama bermakna " + meaning + "." : ""
  } Tampilkan hasilnya dalam bentuk json. Contoh: [{name: "Nama anak", meaning: "Arti dari nama"}]`;

  const messages = [{ role: "user", content: prompt.trim() }];

  try {
    const completions = await openai.createChatCompletion({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    });

    const names = completions.data.choices.map((choice) =>
      choice.message.content.replace(/[\n]/g, "").trim()
    );

    const nameObj = strToJson(names[0]);
    if (nameObj) {
      res.status(200).json(
        nameObj.map((item) => ({
          ...item,
          id: uuid(),
          meaning: item.meaning,
        }))
      );
    } else {
      res.status(400).json({ success: false, message: "False response" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  generateAnswer,
  generateImage,
  generateNames,
};
