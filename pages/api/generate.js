import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Write me a pitch for a product with a hook question, description and conclusion, do this in a Gary Vee style. Please make sure the description goes in depth. Explain every technical concept in basic terms.
Product: `;

const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`);

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = `
    Take the product, hook, description, conclusion and write it in a conversational way. Make it engaging and easy to follow. Make it long enough for 2 minutes. Go into detail on how this solves a problem.

    ${basePromptOutput.text}

    Conversational Version:
    `;

  console.log(`API: ${secondPrompt}`);

  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.8,
    // I also increase max_tokens.
    max_tokens: 1000,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  console.log(`${basePromptOutput.text}
  Conversational version: ${secondPromptOutput.text}`)
  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({
    output: `${basePromptOutput.text} \n Conversational version:${secondPromptOutput.text}`,
  });
};

export default generateAction;
