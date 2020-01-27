const { spawn } = require('child_process');
module.exports = {
    toFlac: function(path){
	return new Promise((res, rej) => {
	    const child = spawn('ffmpeg', ['-y', '-i', path, './audios/input.flac']);
	    child.on('error', err => {
		rej(err);
	    })
	    child.on('close', code => {
		console.log(code)
		if(code === -2){
		    throw new Error("Please make sure ffmpeg is installed.");
		}
		else if(code != 0){
		    throw new Error("File was not transformed to the correct format.");
		}else{
		    res('./audios/input.flac');
		}
	    })

	})
    },
    format: function(format){
	console.log(format);
	return new Promise((res, rej) => {
	    const child = spawn('ffmpeg', ['-y', '-i', './output/output.flac', './output/output.'+format ]);
	    child.on('error', err => {
		rej(err);
	    })
	    child.on('close', code => {
		console.log(code)
		if(code === 1){
		    rej("File was not transformed to the specified format.");
		}else{
		    res('Done');
		}
	    })

	})
    }






}
