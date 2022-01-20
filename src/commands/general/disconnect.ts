import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { ServerQueue } from "../../../typings";
import PermissionCheck from "../utils/permissionCheck";

export default class DisconnectCommand extends Command {
    private currentList: ServerQueue

    constructor() {
        super('disconnect', {
            aliases: ['Disconnect', 'dc'],
            description: 'Disconnect bot from voice channel'
        })
    }

    public async exec(message: Message) {
        this.currentList = await this.client.getQueue(message.guild.id)

        if (!PermissionCheck.isInVoiceChannel(message, this.currentList)) return

        try {
            this.client.clearQueue(message.guild.id)
            this.currentList.connection.destroy()
            message.channel.send(`Ciao`)
        } catch (err) {
            console.log(err)
            message.channel.send(err.message)
        }
    }
}