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
  // const prompt = `
  //   Generate 5 names and short meaning of the name (not too short). The name criteria would be:
  //   ${origin && origin !== "" ? `The origin of the name is ${origin}. ` : ""}
  //   ${gender && gender !== "" ? `The gender of the name is ${gender}. ` : ""}
  //   ${
  //     wordLength && wordLength !== ""
  //       ? `The name lengths are ${wordLength} words. `
  //       : ""
  //   }
  //   ${meaning && meaning !== "" ? `The meaning of the name ${meaning}. ` : ""}
  //   Make the result in one line only, translate everything into Bahasa Indonesia and separate the point with semicolon. Sample result "Name: Meaning; Name: Meaning;"
  // `;
  const prompt = `Buat 5 nama anak bayi yang unik ${
    gender || ""
  } dan artinya. ${
    wordLength ? "Minimal " + wordLength + " kata pada nama." : ""
  } ${origin ? "Nama dalam bahasa " + origin + "." : ""} ${
    meaning ? "Nama mengandung makna " + meaning + "." : ""
  } Tampilkan hasilnya dalam satu baris tanpa nomor dan pisahkan setiap poin dengan semicolon, contoh hasil "Nama: Arti; Nama: Arti"`;
  // const prompt = `
  //   Buat 5 nama anak beserta artinya dengan kriteria: ${
  //     gender ? "anak " + gender + ", " : ""
  //   } ${origin ? "bahasa " + origin + ", " : ""}${
  //   wordLength ? "panjang nama " + wordLength + " suku kata, " : ""
  // }${
  //   meaning ? "nama mempunyai arti " + meaning + ", " : ""
  // }. Buatkan hasilnya dalam satu baris tanpa numbering dan pisahkan setiap poin dengan semicolon, contoh hasil respon "Nama: Arti; Nama: Arti"
  // `;

  try {
    const completions = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0,
        n: 1,
      },
      {
        timeout: 45000,
      }
    );

    const names = completions.data.choices.map((choice) =>
      choice.text.replace(/[\n]/g, "").trim()
    );

    try {
      const result = names[0]
        .split(";")
        ?.map((strArr) => ({
          id: uuid(),
          name: strArr.split(":")[0]?.trim(),
          meaning: strArr.split(":")[1]?.trim(),
        }))
        ?.filter((name) => name.name);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ result: names[0], error });
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
