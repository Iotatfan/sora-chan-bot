import { AudioPlayerStatus } from '@discordjs/voice'
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

        if (currentList.subs.player.state.status !== AudioPlayerStatus.Idle) {
            try {
                currentList.subs.player.stop()
                message.channel.send(':fast_forward: Skipping Current Song')
            }
            catch (e) {
                message.channel.send('Please wait for a second')
            }
        }
    }
}