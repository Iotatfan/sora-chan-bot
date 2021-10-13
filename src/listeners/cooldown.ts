import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Cooldown extends Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    exec(message: Message, command, reason) {
        message.reply(`Please try again after ${(reason / 1000).toFixed()} seconds`)
            .then(msg => msg.delete({
                timeout: reason
            }))
    }
}