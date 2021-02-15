import * as ytdl from 'ytdl-core'
import * as ytpl from 'ytpl'

const spotifyPlaylistRegex = '^(https:\/\/open.spotify.com\/user\/spotify\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$'

export default class QueryResolver {

    static isSpotifyPlaylist(query) {
        return query.match(spotifyPlaylistRegex)
    }
    
    static isYTPlaylist(query) {
        return ytpl.validateID(query)
    }

    static isYTVideo(query) {
        return ytdl.validateURL(query)
    }
}