import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Collection, Message } from 'discord.js';
import { ServerQueue, Track } from '../../typings'

export default class BotClient extends AkairoClient {
    constructor() {
        super()

        // this.commandHandler.resolver.addType('music', (_, phrase: string) => {
        //     if (!phrase) return null;
        //     if (phrase.length <= 2) return null;
      
        //     return phrase.replace(/<(.+)>/, '$1');
        // });

    }

    private readonly prefix = process.env.PREFIX

    public readonly token = process.env.TOKEN 

    public commandHandler = new CommandHandler(this, {
        allowMention: true,
        commandUtil: true,
        directory: __dirname + '/../commands',
        prefix: this.prefix
    })

    public queues = this.util.collection<String, ServerQueue>()
    
    private async _init() {
        this.commandHandler.loadAll()
    }

    public async getQueue (guildID: String) {
        const queue = () => this.queues.get(guildID)

        if (!queue()) {
            
            let values: ServerQueue = {
                connection: null,
                guildID: guildID,
                playing: false,
                tracks: [],
                voiceChannel: null,
            }
            await this.setQueue(guildID, values)
        }
        return queue();
    }

    public async setQueue (guildID: String, values) {
        console.log('Creating Queue ')
        this.queues.set(guildID, values)

        return this.getQueue(guildID)
    }

    public async listen() {
        await this._init()

        return this.login(this.token)
    }
}