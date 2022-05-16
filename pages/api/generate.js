import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    const completion = await openai.createCompletion("text-davinci-001", {
        prompt: generatePrompt(req.body.prompt, req.body.language),
        temperature: 0.6,
        max_tokens: 1000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
}

function generatePrompt(prompt, language) {
    console.log(prompt);
    console.log(language);
    if (language == "n/a") {
        return prompt;
    } else {
        return `
        Prompt: name an animal in English and French
        Response: English: cat French: dog
        Prompt: name a country in English and Spanish
        Response: English: Canada Spanish: Canadá
        Prompt: generate a poem in English and French
        Response: English: Beneath the stars, I sit and dream Of a world far away Where the sun always shines And the moon never sets. In this world, There are no worries And everyone is happy. I close my eyes And transport myself To this magical place. French: Sous les étoiles, Je m'assois et je rêve D'un monde lointain Où le soleil brille toujours Et la lune ne se couche jamais. Dans ce monde, Il n'y a pas de soucis Et tout le monde est heureux. Je ferme les yeux Et je me transporte Dans ce lieu magique.
        Prompt: ${prompt} in English and ${language}:
        Response:`;
    }
}
