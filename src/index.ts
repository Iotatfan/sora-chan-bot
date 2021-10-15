require('dotenv').config();
import BotClient from "./client/bot"

const client = new BotClient()

client.on('ready', () => {
    console.log("I'm Not Ready")
    client.user.setActivity('Some Music', {
        type: 'PLAYING'
    })
})

client.on('error', (err) => {
    console.log(err)
})

client.listen()