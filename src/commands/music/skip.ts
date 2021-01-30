import { Command } from 'discord-akairo'
import { Message, VoiceChannel } from 'discord.js'
import { ServerQueue, Track } from '../../../typings'

export default class SkipCommand extends Command {
    constructor() {
        super('skip', {
            aliases: ['skip', 's'],
            description: 'Skip Current Song'
        })
    }

    public async exec(message: Message) {
        const currentList = await this.client.getQueue(message.guild.id)
        currentList.connection.dispatcher.end()
    }
}