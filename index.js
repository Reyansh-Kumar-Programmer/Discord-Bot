// Create a Discord Bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Prepare connection to the OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on('messageCreate', async (message) => {
    try {
        if(message.author.bot) return;
        
        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `ChatGPT is a frinedly chatbot.\n\ChatGPT: Hello, how are you ?\n\ ${message.author.username}: ${message.content}\n\ ChatGPT:`,
            temperature: 0.9,
            max_tokens: 159,
            stop: ["ChatGPT:", "RexNoah:"]
        })
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    } catch (error) {
        console.log(error);
    }
});

// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatGPT Bot is online now on Discord!");