import { CommandHandler } from 'discord-akairo'
import { VoiceChannel } from 'discord.js'
import { Collection } from 'discord.js'

interface BotClient {
    commandHandler: CommandHandler
    queues: Collection<String, ServerQueue>

    getQueue(guildID: String): Promise<ServerQueue>
    setQueue(guildID: String, values: ServerQueue): Promise<ServerQueue>
    clearQueue(guildID: String): void
}

declare module 'discord.js' {
    export interface Client extends BotClient { }
}

export interface ServerQueue {
    connection
    guildID: String
    playing: Boolean
    tracks: Track[]
    voiceChannel: VoiceChannel
}

export interface Track {
    url: String
    title: String
    user: String
}