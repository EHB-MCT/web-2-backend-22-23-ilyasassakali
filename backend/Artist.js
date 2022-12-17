// artist class
class Artist {

    constructor(opinion, score, muzzyimg, muzzyartist, username, date, time, idartist, uuid) {
        this.opinion = opinion;
        this.score = score;
        this.muzzyimg = muzzyimg;
        this.muzzyartist = muzzyartist;
        this.username = username;
        this.date = date;
        this.time = time;
        this.idartist = idartist;
        this.uuid = uuid;
    }

}

module.exports = Artist;