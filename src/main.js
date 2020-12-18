const fs = require('fs');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const { checkFormat, checkCommand } = require('./check.js');
const { toFlac, format } = require('./format.js');
const { trim, concat } = require('./ffmpeg.js');
const { speechToText } = require('./speech_to_text.js');
const LinkedList = require('./LinkedList.js');
const sanitize = require('./sanitize.js');
const yargs = require('yargs').options({
    'input':{
	alias:'i',
	describe:'Input audio.',
	demandOption:true
    },
    'ginput':{
	alias:'g',
	describe:'URI from google storage.',
	demandOption:true
    },
    'format':{
	alias: 'f',
	describe: "File output format. Default format is FLAC.",
	demandOption: false
    },
    'censor':{
	alias:'c',
	describe:'Provide the censor audio yourself.',
	demandOption:false
    },
    'badword':{
	alias:'b',
	describe:'Add you own word to censor.',
	demandOption:false
    }
}).help();

const beepFile = yargs.argv.censor?yargs.argv.censor:"./audios/censor.flac";
const fileOutputFormat = yargs.argv.format?yargs.argv.format:"flac";
const wordsToFilter = (function(){
    if(!yargs.argv.badword){
	return require('./badwords.js');
    }else{
	//if only one word-to-filter is provided
	let regex = RegExp('^[A-Za-z]+$');
	if(regex.test(yargs.argv.badword)){
	    return new Set([yargs.argv.badword]);
	}else{
	    return new Set(yargs.argv.badword);
	}
    }
})();


async function init(inputFile){
    rimraf('./output', err => {
	if(err) throw err;
    });
    rimraf('./tmp', err => {
	if(err) throw err;
    });
    if(!await checkFormat(inputFile, beepFile)){
	throw new Error("The format of the two audios are different.");
    }
    try{
	//make a temp directory to store trimmed audios.
	await mkdirp('./tmp');
	await mkdirp('./output');
    } catch(error){
	throw error;
    }
}


async function main() {
    try{
	//format the audio to flac to increase speech-to-text accuracy.
	const inputFile = await toFlac(yargs.argv.input);
	await init(inputFile);
	//get all the badwords in the script.
	const badwords = await speechToText(yargs.argv.ginput, wordsToFilter);
	console.log(badwords);
	//get the audio duration.
	const audioDuration = await getAudioDurationInSeconds(inputFile);
	//starts sanitizing the audios. Returns array [linkedList, PromiseArray]
	//where linkedList is the linkedList of the audios and PromiseArray tells if all the audio have
	//been trimmed to seperate parts.
	const { linkedList, promiseArr } = sanitize(badwords, inputFile, beepFile, audioDuration);
	if(typeof promiseArr == 'undefined') return "Wow! Clean audio!"
	//wait for all the files to finish trimming
	const promiseResult = await Promise.all(promiseArr);
	if(promiseResult.every(data => data)){
	    //concat all the seperated files
	    await concat("./tmp/join.txt", linkedList);
	    //format the output files if the required file format is not flac
	    if(fileOutputFormat !== 'flac'){
		await format(fileOutputFormat);
	    }
	    rimraf('./tmp', err => {
		if(err) return err;
	    });
	    return "Audio is now clean!"
	}else{
	    new Error("Not all audio are sanitized.");
	}
    }catch(err){
	return err.toString();
    }
}

main().then(data => console.log(data)).catch(console.error);



