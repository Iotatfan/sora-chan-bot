import { StreamDispatcher } from 'discord.js'
import { Track } from './track'

export class Queue {
    public connection: StreamDispatcher
    public guildID: String
    public playing: Boolean
    public tracks: Array<Track>
    public voiceChannel: String

    constructor(guildID, message) {
        this.connection = this.connection
        this.guildID = guildID
        this.playing = false
        this.tracks = []
        this.voiceChannel = message.member.voice.channel
    }
}