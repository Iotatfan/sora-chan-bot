import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import {
    AudioPlayer,
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus
} from '@discordjs/voice'
import { ServerQueue, Track } from '../../../typings'
import SpotifyWebApi from 'spotify-url-info'
import QueryResolver from '../utils/queryType'
import PermissionCheck from '../utils/permissionCheck'
import SearchYoutubeVideo from '../utils/search'
import ytdl = require('ytdl-core')
import ytpl = require('ytpl')

export default class PlayCommand extends Command {

    private currentList: ServerQueue
    private message: Message
    private searchYtVideo: SearchYoutubeVideo = new SearchYoutubeVideo()
    private player: AudioPlayer
    private audioResource: AudioResource

    constructor() {
        super('play', {
            aliases: ['Play', 'p'],
            description: 'Play or Add Music to Queue'
        })

        this.player = createAudioPlayer()
    }

    public async exec(message: Message) {
        this.message = message
        const query = message.content.substr(message.content.indexOf(' ') + 1)
        this.currentList = await this.client.getQueue(message.guild.id)

        if (!PermissionCheck.isInVoiceChannel(message, this.currentList)) return

        this.resolveQueryType(query)
    }

    private resolveQueryType(query) {
        if (QueryResolver.isYTPlaylist(query)) {
            this._handleYtPlaylist(query)
        } else if (QueryResolver.isYTVideo(query)) {
            this._handleYtVideo(query)
        } else if (QueryResolver.isSpotifyLink(query)) {
            this._handleSpotifyLink(query)
        } else {
            this._searchYtVideo(query, true)
        }
    }

    private async _handleSpotifyLink(query) {
        const data = await SpotifyWebApi.getTracks(query)

        data.forEach(item => {
            const searchString = `${item.artists[0].name} ${item.name}`
            this._searchYtVideo(searchString, false)
        })

    }
    private async _searchYtVideo(searchString, wait) {
        const track: Track = await this.searchYtVideo.search(this.message, searchString, wait)

        if (!track) return

        this.currentList.tracks.push(track)
        this.join()
    }

    private async _handleYtPlaylist(query) {
        const playlistID = await ytpl.getPlaylistID(query)
        const playlist = await ytpl(playlistID)

        playlist.items.forEach(item => {
            const track: Track = {
                title: item.title,
                url: item.url,
                user: this.message.author.id
            }
            this.currentList.tracks.push(track)
        })
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
        const channel = this.message.member.voice.channel
        this.currentList.channelID = channel.id

        if (!this.currentList.playing) {
            this.currentList.playing = true

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guildId,
                adapterCreator: channel.guild.voiceAdapterCreator
            })

            this.currentList.connection = connection
            this.play(this.currentList.tracks[0])
        }
    }

    private async play(track: Track) {
        if (!track || this.currentList === null) {
            this.currentList.playing = false
            return
        }

        this.currentList.playing = true

        let stream = createAudioResource(ytdl(track.url.toString(), {
            filter: 'audioonly',
            dlChunkSize: 0,
            highWaterMark: 1 << 25
        }))
        this.currentList.subs = this.currentList.connection.subscribe(this.player)

        await this.player.play(stream)

        await this.player.on(AudioPlayerStatus.Idle, () => {
            this.player.play(this.nextTrack())
        })

        await this.player.on('error', error => {
            console.log(error)
        })
    }

    private nextTrack() {
        this.currentList.tracks.shift()

        return createAudioResource(ytdl(this.currentList.tracks[0].url.toString(), {
            filter: 'audioonly',
            dlChunkSize: 0,
            highWaterMark: 1 << 25
        }))

    }
}