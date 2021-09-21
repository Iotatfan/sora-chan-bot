export default class Track {

    public url: String
    public user: String
    public title: String

    constructor(url, title, user) {
        this.url = url
        this.title = title
        this.user = user
    }
}