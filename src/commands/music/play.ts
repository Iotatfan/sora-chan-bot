import { Command } from 'discord-akairo'
import { Message, VoiceChannel } from 'discord.js'
import { ServerQueue, Track } from '../../../typings'
import QueryType from '../util/queryType'
import Queue from '../../models/queue'
import ytdl = require('ytdl-core')
import ytpl = require('ytpl')

export default class PlayCommand extends Command {

    private currentList: ServerQueue
    private message: Message
    private resolver

    constructor() {
        super('play', {
            aliases: ['play', 'p'],
            description: 'Play or Add Music to Queue'
        })

        this.resolver = QueryType
    }

    public async exec(message: Message) {
        this.message = message
        const voiceChannel = message.member.voice.channel
        const query = message.content.substr(message.content.indexOf(' ')+1)
        
        if (!voiceChannel) {
            return message.channel.send(
                "Please join the voice channel first, I'll follow you"
            )
        } 
            
        this.currentList = await this.client.getQueue(message.guild.id)
        this.currentList.voiceChannel = voiceChannel

        this.resolveQueryType(query)
                
    }
   
    private resolveQueryType (query) {
        if (this.resolver.isYTPlaylist(query)) {
            this._handlePlaylist(query)
        } else {
            return 'search'
        }
    }

    private async _handlePlaylist(query) {
        const playlistID = await ytpl.getPlaylistID(query)
        const playlist = await ytpl(playlistID)
        for (let item of playlist.items) {
            const track: Track = {
                url: item.url,
                thumbnail: item.bestThumbnail.url,
                title: item.title,
                user: this.message.author.id
            }
            this.currentList.tracks.push(track)
        }
        this.join()
    }

    private join() {
        if (!this.currentList.playing) {
            this.currentList.playing = true

            this.currentList.voiceChannel.join()
                .then(conn => {
                    this.currentList.connection = conn
                    this.play(this.currentList.tracks[0])
                })
        }
    }

    private play(track: Track) {
        if (!track) {
            this.currentList.voiceChannel.leave()
            return
        }

        this.currentList
            .connection
            .play(ytdl(track.url.toString() , {
                filter: 'audio',
                highWaterMark: 1 << 25
            }))
            .on('finish', () => {
                this.currentList.tracks.shift()
                this.play(this.currentList.tracks[0])
            })
    }
}