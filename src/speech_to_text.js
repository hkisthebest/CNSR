const Word = require('./Word.js');
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

module.exports = {
    speechToText: async function (fileName, badwords) {
	let Words = [];

	// Creates a client
	const client = new speech.SpeechClient();

	const file = fs.readFileSync(fileName);
	const audioBytes = file.toString('base64');

	// The audio file's encoding, sample rate in hertz, and BCP-47 language code
	const audio = {
	    content: audioBytes,
	};
	const config = {
	    encoding: 'flac',
	    audioChannelCount: 2,
	    // sampleRateHertz: 16000,
	    enableWordTimeOffsets: true,
	    languageCode: 'en-US',
	};
	const request = {
	    audio: audio,
	    config: config,
	};

	// Detects speech in the audio file. This creates a recognition job that you
	// can wait for now, or get its result later.
	try {
	    const [operation] = await client.longRunningRecognize(request);
	    const [response] = await operation.promise();
	    const transcription = response.results.forEach((result) => {
		result.alternatives[0].words.forEach(e => {
		    let startSecs = parseInt(e.startTime.seconds) + e.startTime.nanos / 1000000000;
		    let endSecs = parseInt(e.endTime.seconds) + e.endTime.nanos / 1000000000;
		    if (badwords.has(e.word)) {
			Words.push({
			    word: e.word,
			    startTime: startSecs,
			    endTime: endSecs,
			    duration: Math.round((endSecs - startSecs) * 100) / 100 == 0 ? 0.1 : Math.round((endSecs - startSecs) * 100) / 100
			})
		    }
		})

	    })
	} catch (err) {
	    return err
	}
	return Words;
    }
}
