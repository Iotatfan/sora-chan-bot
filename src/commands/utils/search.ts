import { Message, MessageEmbed } from 'discord.js'
import { Track } from '../../../typings'
import ytsr = require('ytsr')

export default class SearchYoutubeVideo {
    private response: string
    private track: Track
    private query: String

    public async search(message: Message, query) {
        this.query = query

        this.query = message.content.substr(message.content.indexOf(' ')+1)

        const filters1 = await ytsr.getFilters(this.query.toString())
        const filter1 = filters1.get('Type').get('Video')
        const options = {
            limit: 5
        }
        const searchResults = (await ytsr(filter1.url, options)).items
        
        await this.waitUserResponse(message, searchResults)

        return this.track
    }

    private async waitUserResponse(message: Message, searchResults) {
        const filter = m => m.author.id == message.author.id

        const embed = new MessageEmbed()
            .setColor('00FF00')
            .setTitle(`Search Result for ${this.query}`)

        for (let i = 0; i < 5; i++) {
            embed.addField(`${i+1}. ${searchResults[i].title}`, '\u200B', false)
        }
        
        message.channel.send(embed)
            .then(msg => msg.delete({
                timeout: 10000
            }))
            .catch(err => {})

        await message.channel.awaitMessages(filter, {
            max: 1,
            time: 10000,
            errors: ['time']
        }).then(async(collected) => {
            if (collected.first().content.toLowerCase() == 'cancel') {
                message.reply("Command has been cancelled")
            }
            this.response = collected.first().content
        }).catch(() => {
            message.reply("Message Timeout")
        })

        this.addToQueue(message, searchResults)

    }

    private addToQueue(message: Message, searchResults) {
        const index = parseInt(this.response)-1

        if (!searchResults[index]) return message.reply("Invalid Number")

        this.track = {
            thumbnail: searchResults[index].thumbnails[0].url,
            title: searchResults[index].title,
            url: searchResults[index].url,
            user: message.author.id
        }

        const embed = new MessageEmbed()
            .setColor('00FF00')
            .setTitle('Added to Queue')
            .setThumbnail(this.track.thumbnail.toString())
            .setURL(this.track.url.toString())
            .setDescription(`${this.track.title}`)
            
        message.channel.send(embed)      
    }
}