import * as ytdl from 'ytdl-core'
import * as ytpl from 'ytpl'

export default class QueryResolver {

    static isSpotifyLink(query) {
        const spotifyRegex = /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|playlist\/))(.*)$/
        return spotifyRegex.test(query)
    }

    static isYTPlaylist(query) {
        return ytpl.validateID(query)
    }

    static isYTVideo(query) {
        return ytdl.validateURL(query)
    }
}