import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { ServerQueue } from '../../../typings'
import PermissionCheck from '../utils/permissionCheck'

export default class StopCommand extends Command {
    constructor() {
        super('stop', {
            aliases: ['Stop'],
            description: 'Stop playing music then leave voice channel',
        })
    }

    public async exec(message: Message) {
        const currentList: ServerQueue = await this.client.getQueue(message.guild.id)

        if (!PermissionCheck.isInVoiceChannel(message, currentList)) return

        if (currentList.playing) {
            try {
                currentList.connection.dispatcher.destroy()
                currentList.tracks = []
                currentList.playing = false
                message.channel.send('Music stopped')
            } catch (e) {
                console.log(e)
            }
        }

    }
}