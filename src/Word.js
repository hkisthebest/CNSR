module.exports = class Word {
    constructor(word, startTime, endTime) {
        this.word = word;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = endTime - startTime
    }
}
