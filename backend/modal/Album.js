// album class
class Album {

    constructor(opinion, score, muzzyimg, muzzyalbum, muzzyartist, username, date, time, idalbum, uuid) {
        this.opinion = opinion;
        this.score = score;
        this.muzzyimg = muzzyimg;
        this.muzzyalbum = muzzyalbum;
        this.muzzyartist = muzzyartist;
        this.username = username;
        this.date = date;
        this.time = time;
        this.idalbum = idalbum;
        this.uuid = uuid;
    }

}

module.exports = Album;