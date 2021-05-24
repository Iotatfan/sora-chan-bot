import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { ServerQueue } from '../../../typings'

export default class ShuffleCommand extends Command {
    constructor() {
        super('shuffle', {
            aliases: ['Shuffle', 'random'],
            description: 'Shuffle Current Queue'
        })
    }

    public async exec(message: Message) {
        const currentList : ServerQueue = await this.client.getQueue(message.guild.id)
        
        if (!currentList.playing) return message.reply("Nothing to Play")
        
        if (currentList.tracks.length < 3) return message.channel.send('Queue is too short')

        for (let i = currentList.tracks.length - 1; i > 1; --i) {
            const j = Math.ceil(Math.random() * i)
            const temp = currentList.tracks[i]
            currentList.tracks[i] = currentList.tracks[j]
            currentList.tracks[j] = temp
        }

        message.channel.send(':twisted_rightwards_arrows: Queue shuffled')
    }
}