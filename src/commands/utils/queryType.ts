import * as ytdl from 'ytdl-core'
import * as ytpl from 'ytpl'

export default class QueryResolver {

    static isSpotifyPlaylist(query) {
        const spotifyRegex = /^(?:spotify:|https:\/\/[a-z]+\.spotify\.com\/(track\/|playlist\/))(.*)$/
        console.log(spotifyRegex.test(query))
        return spotifyRegex.test(query)
    }

    static isYTPlaylist(query) {
        return ytpl.validateID(query)
    }

    static isYTVideo(query) {
        return ytdl.validateURL(query)
    }
}