# vk-audio-analyse
Script for analysing your and your vk friends audios for finding similar audios and estimating percentage of similarity

### Prerequisites
Create .env file with vk api token in root folder.
```
ACCESS_TOKEN=token
```
You can generate token here: https://github.com/vodka2/vk-audio-token.


### Installing
install dependencies:
```
yarn
```

## Running
```
yarn start
```

Script will generate file *data.json* with all data.
Then you can run:
```
node analyse.js
```
