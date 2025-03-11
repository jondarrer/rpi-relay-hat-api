# rpi-relay-hat-api

An API to control the Waveshare RPi Relay Board.

## Install dependencies (on Raspberry Pi only)

### Install pigpio

```sh
sudo apt-get update
sudo apt-get install pigpio
```

### Symlink node, npm & yarn

<https://github.com/fivdi/pigpio/issues/124>

```sh
sudo ln -s "$(which node)" /usr/local/bin/node
sudo ln -s "$(which npm)" /usr/local/bin/npm
sudo ln -s "$(which yarn)" /usr/local/bin/yarn
```

## Build application

```sh
yarn
yarn build
```

## Configure the application

Create a .env file and add details of the channels and server port, something like:

```sh
RELAY_HAT_CHANNELS=[{ "channelId": "CH1", "pinNo": 26, "mode": 1, "name": "Mirror Light" }, { "channelId": "CH2", "pinNo": 20, "mode": 1, "name": "Mirror Demister" }]
PORT=3000
```

## Run

```sh
sudo yarn start
```

## Managed process

Use [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) to setup the script when booting up.

### Install pm2

```sh
npm i -g pm2
sudo ln -s "$(which pm2)" /usr/local/bin/pm2
```

### Add process to startup script

```sh
sudo pm2 start "ENV_FILE_PATH=/home/jondarrer/code/rpi-relay-hat-api/.env sudo yarn --cwd /home/jondarrer/code/rpi-relay-hat-api start" --name "waveshare-api"
sudo pm2 startup
sudo pm2 save
# sudo pm2 stop waveshare-api
# sudo pm2 restart waveshare-api
# sudo pm2 delete waveshare-api
```

## Test

```sh
yarn test
```
