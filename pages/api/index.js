// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import { ChatGPTAPIBrowser } from "chatgpt"
import axios from 'axios'

async function chatgptFunction (content) {

  try {
    const api = new ChatGPTAPIBrowser({
      email: process.env.CHAT_EMAIL,
      password: process.env.CHAT_PASS
    })
    await api.initSession()

    const getDomainName = await api.sendMessage(`Can you generate a domain name for a website about: ${content}`)
    let domainName = getDomainName.response;

    const generatePrompt = await api.sendMessage(`I have a website for ${content}, and I want to generate a logotype for it. Can you generate a prompt for dall-e? Make it around 50 words long.`)
    const stableDiffusionPrompt = generatePrompt.response;

    const request = await axios.post("http://127.0.0.1:7860/sdapi/text2img", {
      prompt: stableDiffusionPrompt
    })

    let logoImage = await request.data.images
    return { logoImage, domainName }
  } catch (err) {
    console.error(err);
  }
}

const database = []

export default async function handler (req, res) {
  const { prompt } = req.body;
  const result = await chatgptFunction(prompt)
  database.push(result)
  res.status(200).json({ message: "Retrieved successfully!", result: database });
}
