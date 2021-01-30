export default class Track {

    public url: String
    public thumbnail: String
    public user: String
    public title: String

    constructor (url, thumbnail, title, user) {
        this.url = url
        this.thumbnail = thumbnail
        this.title = title
        this.user = user
    }
}