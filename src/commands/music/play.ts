import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { ServerQueue, Track } from '../../../typings'
import Spotify from 'spotify-url-info'
import QueryResolver from '../utils/queryType'
import PermissionCheck from '../utils/permissionCheck'
import SearchYoutubeVideo from '../utils/search'
import ytdl = require('ytdl-core')
import ytpl = require('ytpl')

export default class PlayCommand extends Command {

    private currentList: ServerQueue
    private message: Message
    private searchYtVideo: SearchYoutubeVideo = new SearchYoutubeVideo()

    constructor() {
        super('play', {
            aliases: ['Play', 'p'],
            description: 'Play or Add Music to Queue'
        })
    }

    public async exec(message: Message) {
        this.message = message
        const voiceChannel = message.member.voice.channel
        const query = message.content.substr(message.content.indexOf(' ')+1)
        
        this.currentList = await this.client.getQueue(message.guild.id)
        this.currentList.voiceChannel = voiceChannel
        
        if (!PermissionCheck.isInVoiceChannel(message, this.currentList)) return

        this.resolveQueryType(query)
                
    }
   
    private resolveQueryType (query) {
        if (QueryResolver.isYTPlaylist(query)) {
            this._handleYtPlaylist(query)
        } else if (QueryResolver.isYTVideo(query)) {
            this._handleYtVideo(query)
        } else if (QueryResolver.isSpotifyPlaylist(query)) {
            this._handleYtVideo(query)
        } else {
            this._searchYtVideo(query)
        }
    }

    private async _handleSpotifyPlaylist(query) {

    }

    private async _searchYtVideo(query) {
        const track: Track = await this.searchYtVideo.search(this.message, query)

        if (!track) return

        this.currentList.tracks.push(track)
        this.join()
    }

    private async _handleYtPlaylist(query) {
        const playlistID = await ytpl.getPlaylistID(query)
        const playlist = await ytpl(playlistID)
        for (let item of playlist.items) {
            const track: Track = {
                title: item.title,
                url: item.url,
                user: this.message.author.id
            }
            this.currentList.tracks.push(track)
        }
        this.join()
    }

    private async _handleYtVideo(query) {
        const trackInfo = await ytdl.getInfo(query)

        const track: Track = {
            title: trackInfo.videoDetails.title,
            url: trackInfo.videoDetails.video_url,
            user: this.message.author.id
        }
        this.currentList.tracks.push(track)
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
            this.currentList.playing = false
            this.client.user.setActivity('Chillin',{
                type: 'CUSTOM_STATUS'
            })
            return
        }

        this.currentList.playing = true
        this.client.user.setActivity(track.title.toString(), {
            type: 'LISTENING'
        })

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
            .on('error', err => {
                console.log(err)

                if (err.code === 'EPIPE') return this.play(this.currentList.tracks[0])

                this.play(this.currentList.tracks[0])
            })
    }
}