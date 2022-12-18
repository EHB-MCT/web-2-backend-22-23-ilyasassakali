// track class
class Track {

    constructor(opinion, score, muzzyimg, muzzytrack, muzzyartist, username, date, time, idtrack, uuid) {
        this.opinion = opinion;
        this.score = score;
        this.muzzyimg = muzzyimg;
        this.muzzytrack = muzzytrack;
        this.muzzyartist = muzzyartist;
        this.username = username;
        this.date = date;
        this.time = time;
        this.idtrack = idtrack;
        this.uuid = uuid;
    }

}

module.exports = Track;