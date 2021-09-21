import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { ServerQueue } from '../../../typings'
import PermissionCheck from '../utils/permissionCheck'

export default class SkipCommand extends Command {
    constructor() {
        super('skip', {
            aliases: ['Skip', 's'],
            description: 'Skip Current Song',
        })
    }

    public async exec(message: Message) {
        const currentList: ServerQueue = await this.client.getQueue(message.guild.id)

        if (!PermissionCheck.isInVoiceChannel(message, currentList)) return

        if (currentList.playing) {
            try {
                currentList.connection.dispatcher.end()
                message.channel.send(':fast_forward: Skipping Current Song')
            }
            catch (e) {
                message.channel.send('Please wait for a second')
            }
        }
    }
}