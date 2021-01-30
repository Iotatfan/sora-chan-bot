import * as ytdl from 'ytdl-core'
import * as ytpl from 'ytpl'

export default class QueryResolver {
    
    static isYTPlaylist(query) {
        return ytpl.validateID(query)
    }

    static isYTVideo(query) {
        return ytdl.validateURL(query)
    }
}