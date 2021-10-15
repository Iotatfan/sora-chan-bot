import { PlayerSubscription, VoiceConnection } from '@discordjs/voice'
import { CommandHandler } from 'discord-akairo'
import { Collection, VoiceChannel } from 'discord.js'

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
    connection: VoiceConnection
    guildID: String
    playing: Boolean
    tracks: Track[]
    subs: PlayerSubscription
    channelID: String
}

export interface Track {
    url: String
    title: String
    user: String
}