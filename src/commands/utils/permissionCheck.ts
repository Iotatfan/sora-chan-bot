import { Message } from 'discord.js'
import { ServerQueue } from '../../../typings'

export default class PermissionCheck {

    static isInVoiceChannel(message: Message, currentList: ServerQueue) {
        const userVoiceChannel = message.member.voice.channel
        const joinedVoiceChannel = currentList.voiceChannel

        if (!userVoiceChannel) {
            message.channel.send(
                "Please join the voice channel first"
            )
            return false
        } else if (userVoiceChannel !== joinedVoiceChannel && joinedVoiceChannel !== null) {
            message.channel.send(
                "Already bound to another voice channel"
            )
            return false
        } else {
            return true
        }
    }

}