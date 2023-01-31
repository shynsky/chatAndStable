// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import { ChatGPTAPIBrowser } from "chatgpt"

async function chatgptFunction (content) {
  try {
    const api = new ChatGPTAPIBrowser({
      email: process.env.CHAT_EMAIL,
      password: process.env.CHAT_PASS
    })
    await api.initSession()

    const getDomainName = await api.sendMessage(`Can you generate a domain name for a website about: ${content}`)
    let domainName = getDomainName.response;

    const generatePrompt = await api.sendMessage(`I have a website fro ${content}, and I want to generate a logotype for it. Can you generate a prompt for dall-e? Make it around 50 words long.`)
    let stableDiffusionPrompt = generatePrompt.response;

    console.log({ domainName, diffusionPrompt })

  } catch (err) {
    console.error(err);
  }
}

export default async function handler (req, res) {
  const { prompt } = req.body;
  const result = await chatgptFunction(prompt)
  res.status(200).json({ message: "Retrieved successfully!" });
}
