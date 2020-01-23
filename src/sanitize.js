const { trim } = require('./ffmpeg.js');
const LinkedList = require('./LinkedList.js');

let sanitize = function (badwords, inputFile, beepFile, audioDuration) {
    try {
	//create a linked list to store the audio order.
	const linkedList = new LinkedList();
	let promiseArr = [];
	for (let i = 0; i < badwords.length; i++) {
	    if (i === 0) {
		let firstOutputName = "FirstAudio.flac";
		promiseArr.push(trim(badwords[i].startTime, inputFile, firstOutputName).then(() => true).catch(() => false));
		linkedList.insertAtEnd(firstOutputName);
		promiseArr.push(trim(badwords[i].duration, beepFile, i + "censorAudio.flac").then(() => true).catch(() => false));
		linkedList.insertAtEnd(i + "censorAudio.flac");
	    } else {
		promiseArr.push(trim(badwords[i].startTime - badwords[i - 1].endTime, inputFile, i + "oriAudio.flac", badwords[i - 1].endTime).then(() => true).catch(() => false));
		linkedList.insertAtEnd(i + "oriAudio.flac");
		promiseArr.push(trim(badwords[i].duration, beepFile, i + "censorAudio.flac", badwords[i - 1].endTime).then(() => true).catch(() => false));
		linkedList.insertAtEnd(i + "censorAudio.flac");
	    }
	}
	promiseArr.push(trim(audioDuration - badwords[badwords.length - 1].endTime, inputFile, "lastAudio.flac", new Date(badwords[badwords.length - 1].endTime * 1000).toISOString().substr(11, 10)).then(() => true).catch(() => false));
	linkedList.insertAtEnd("lastAudio.flac");
	return { linkedList, promiseArr };
    } catch (e) {
	return new Error('Error sanitizing');
    }
}

module.exports = sanitize;


