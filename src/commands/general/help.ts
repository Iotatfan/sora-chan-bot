import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class HelpCommand extends Command {

    constructor() {
        super('help', {
            aliases: ['Help', 'h'],
            description: 'See list of command'
        })
    }

    public async exec(message: Message) {
        const embed = new MessageEmbed()
            .setColor('00FF00')
            .setTitle('Click here to see commands list')
            .setURL('https://iotatfan.github.io/sora-chan-web/#/commands')

        message.channel.send(embed)
    }
}