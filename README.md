<img src="https://github.com/hkisthebest/CNSR/blob/master/CNSR.png" alt="CNSR" width="200" height="125"/>

# CNSR

CNSR is an audio censor written in Javascript, using Node.js.

## Setup

CNSR uses Google Speech-to-text API, so a google credential is required. Setup your project [here](https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries). Remember to point the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to your credentials. In order to convert audio longer than 1 minute to text with the Google Speech-to-text API, uploading the audio(the encoding should be flac to increase the accuracy of the speech-to-text process) to the cloud storage is required.

```
npm install
```
CNSR also requires `ffmpeg`. Typing `ffmpeg` in command line to check if you have it installed. [ffmpeg](https://www.ffmpeg.org/download.html) to download. Or install it through homebrew.
```bash
brew install ffmpeg
```
At last, the Google Cloud SDK [here](https://cloud.google.com/sdk/docs/downloads-interactive).


## Usage
At the project root directory. The reason to both specify the URI and the input file is because the URI is only used in the Speech-to-text process, and the input file is used for trimming.
```bash
npm run censor -- -i <input file> -g <google cloud storage URI>
```
`-i` and `-g` is required.  
  
Add the censor file yourself, if not provided, the default censor file in the audios directory would be used.
```bash
npm run censor -- -i <input file> -g <google cloud storage URI> -c <censor file>
```
Specify the output format by adding `-f`
```bash
npm run censor -- -i <input file> -g <google cloud storage URI> -f mp3
```
Specify your own badword by using `-b`
```bash
npm run censor -- -i <input file> -g <google cloud storage URI> -b <badword>
```
## Note
The default censor audio is 24 bit depth. If your audio isn't, please provide your own censor audio.

## License
#### &nbsp;&nbsp;MIT
