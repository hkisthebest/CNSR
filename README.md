<img src="https://github.com/hkisthebest/CNSR/blob/master/CNSR.png" alt="CNSR" width="200" height="125"/>

# CNSR

CNSR is an audio censor written in Javascript, using Node.js.

## Setup

CNSR uses Google Speech-to-text API, so a google credential is required. Setup your project [here](https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries). Remember to point the environment variable `GOOGLE_APPLICATION_CREDENTIALS` to your credentials.
```
npm install
```
CNSR also requires `ffmpeg`. Typing `ffmpeg` in command line to check if you have it installed. [ffmpeg](https://www.ffmpeg.org/download.html) to download. Or install it through homebrew.
```bash
brew install ffmpeg
```
At last, the Google Cloud SDK [here](https://cloud.google.com/sdk/docs/downloads-interactive).


## Usage
At the project root directory.
```bash
npm run censor -- -i <input file>
```
`-i` is required.  
  
Add the censor file yourself, if not provided, the default censor file in audios would be used.
```bash
npm run censor -- -i <input file> -c <censor file>
```
Specify the output format by adding `-f`
```bash
npm run censor -- -i <input file> -f mp3
```
Specify your own badword by using `-b`
```bash
npm run censor -- -i <input file> -b <badword>
```

## License
#### &nbsp;&nbsp;MIT
