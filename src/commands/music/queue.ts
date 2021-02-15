import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { ServerQueue } from '../../../typings'

export default class QueueCommand extends Command {
    constructor() {
        super('queue', {
            aliases: ['Queue', 'q'],
            description: 'Show Current Queue'
        })
    }

    public async exec(message: Message) {
        const currentList : ServerQueue = await this.client.getQueue(message.guild.id)
        const tracks = currentList.tracks
        
        const embed = new MessageEmbed()
            .setColor('00FF00')
            .setTitle('Now Playing')
            .setThumbnail(tracks[0].thumbnail.toString())
            .setURL(tracks[0].url.toString())
            .setDescription(`${tracks[0].title}`)
            .addFields(
            { name: '\u200B', value: '\u200B', inline: false },
            { name: 'Up Next', value: '\u200B', inline: false }
        )

        let length = tracks.length
        if (length > 11) length = 11
        if (length > 1) {
        for (let i = 1; i < length; i++) {
            embed.addField(`${i}.  ${tracks[i].title}`, `Requested by: <@${tracks[i].user}>`, false)
            }
        }
        message.channel.send(embed)
    }
}