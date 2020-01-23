const fs = require('fs');
const { spawn } = require('child_process');


const makeTxt = function (txtPath, linkedList) {
    const stream = fs.createWriteStream(txtPath);
    let current = linkedList.head;
    stream.write("file ./" + current.data + "\n");
    while (current.next != null) {
	current = current.next;
	stream.write("file ./" + current.data + "\n");
    }
}

module.exports = {
    trim: function (duration, audio, outputFile, startTime = "00:00:00") {
	console.log({ audio: audio, startTime: startTime, duration: duration, outputFile: outputFile });
	return new Promise((res, rej) => {
	    const child = spawn('ffmpeg', ["-n", "-i", audio, "-ss", startTime, "-codec", "copy", "-t", duration, "./tmp/" + outputFile]);
	    child.on('error', err => {
		console.log("In error at trimming function");
		rej();
	    })
	    child.on('close', (code) => {
		if (code === 1) rej();
		else res();
	    })
	})
    },
    concat: function (txtPath, linkedList) {
		makeTxt(txtPath, linkedList);
		return new Promise((res, rej) => {
	    const child = spawn('ffmpeg', ["-y","-f", "concat", "-safe", "0", "-i", txtPath, "-c", "copy", "./output/output.flac"]);
	    child.on('close', (code) => {
		if (code === 1) {
		    rej("Error from concat")
		} else {
		    res("Done");
		}
	    })
	})
    }
}
