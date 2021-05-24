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
        
        if (!currentList.playing) return message.reply("Nothing to Play")
        
        const tracks = currentList.tracks
                
        const embed = new MessageEmbed()
            .setColor('00FF00')
            .setTitle('Now Playing')
            .setURL(tracks[0].url.toString())
            .setDescription(`${tracks[0].title}`)
            .addFields(
            { name: '\u200B', value: '\u200B', inline: false },
            { name: 'Up Next', value: '\u200B', inline: false }
        )

        tracks
            .filter((track, index) => index > 0 && index < 11)
            .forEach((track, index) => embed.addField(`${index+1}. ${track.title} `, `Requested by: <@${track.user}>`,false) )

        message.channel.send(embed)
    }
}