const { spawn } = require('child_process');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
module.exports = {
    checkFormat:  async function(file1, file2){
	let info1 = await ffprobe(file1, { path: ffprobeStatic.path });
	info1 = info1.streams[0];
	let info2 = await ffprobe(file2, { path: ffprobeStatic.path});
	info2 = info2.streams[0];
	if(info1.sample_rate === info2.sample_rate && info1.channels === info2.channels && info1.bits_per_raw_sample === info2.bits_per_raw_sample){
	    return true
	}else{
	    return false
	}
    }
}
