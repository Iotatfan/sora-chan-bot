require('dotenv').config();
import BotClient from "./client/bot"

const client = new BotClient()

client.on('ready', () => {
    console.log("I'm Ready")
})

client.on('error', (err) => {
    console.log("Error")
    client.user.setActivity(
    err.message,
    {
        type: 'CUSTOM_STATUS'
    })
})


client.listen()