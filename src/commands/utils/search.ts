import { Message, MessageEmbed } from 'discord.js'
import { Track } from '../../../typings'
import ytsr = require('ytsr')

export default class SearchYoutubeVideo {
    private track: Track
    private query: String
    private waitForRespone: boolean

    public async search(message: Message, query, waitForRespone) {
        this.waitForRespone = waitForRespone
        this.query = query
        const filters1 = await ytsr.getFilters(this.query.toString())
        const filter1 = filters1.get('Type').get('Video')
        const options = {
            limit: waitForRespone ? 5 : 1
        }
        const searchResults = (await ytsr(filter1.url, options)).items

        waitForRespone ? await this.waitUserResponse(message, searchResults) : this.addToQueue(message, searchResults, 1)
        return this.track
    }

    private async waitUserResponse(message: Message, searchResults) {
        const filter = m => m.author.id == message.author.id

        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle(`Search Result for ${this.query}`)

        searchResults.forEach((result, index) => embed.addField(`${index + 1}. ${result.title}`, '\u200B', false))
        embed.addField(`Type "cancel" to cancel the command`, '\u200B', false)

        message.channel.send({ embeds: [embed] })
            .then(msg => {
                setTimeout(() => {
                    try {
                        msg.delete()
                    } catch (err) {
                        console.log(err)
                        message.channel.send(err.message)
                    }
                }, 10000)
            })

        await message.channel.awaitMessages({ filter: filter, max: 1, time: 10000, errors: ['time'] })
            .then(async collected => {
                collected.first().content.toLowerCase() === 'cancel'
                    ? message.reply("Command has been cancelled")
                    : this.addToQueue(message, searchResults, collected.first().content)
            })
            .catch(() => {
                message.reply("Tired waiting for you")
            })
    }

    private addToQueue(message: Message, searchResults, response) {
        const index = parseInt(response) - 1

        if (!searchResults[index]) return message.reply("That's illegal")

        this.track = {
            title: searchResults[index].title,
            url: searchResults[index].url,
            user: message.author.id
        }

        if (this.waitForRespone) {
            const embed = new MessageEmbed()
                .setColor('#00FF00')
                .setTitle('Added to Queue')
                .setURL(this.track.url.toString())
                .setDescription(`${this.track.title}`)

            message.channel.send({ embeds: [embed] })
        }
    }
}