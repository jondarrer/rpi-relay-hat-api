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

## Install and run the package

```sh
yarn dlx rpi-relay-hat-api
```

### Configure the application

Create a rpi-relay-hat-api.env file (in a globally accessible location will allow it to be run as a service) and add details of the channels and server port, something like:

```sh
RELAY_HAT_CHANNELS=[{ "channelId": "CH1", "pinNo": 26, "mode": 1, "name": "Mirror Light" }, { "channelId": "CH2", "pinNo": 20, "mode": 1, "name": "Mirror Demister" }]
PORT=3000
```

### Run the package

```sh
ENV_FILE_PATH=/usr/lib/node_modules/rpi-relay-hat-api/rpi-relay-hat-api.env rpi-relay-hat-api
```

## Development options

Rather than installing the package, these development options allow it to be run and tested:

## Download the package

```sh
git clone git@github.com:jondarrer/rpi-relay-hat-api
cd rpi-relay-hat-api
```

### Build application

```sh
yarn
yarn build
```

### Configure the application

Create a .env file and add details of the channels and server port, something like:

```sh
RELAY_HAT_CHANNELS=[{ "channelId": "CH1", "pinNo": 26, "mode": 1, "name": "Mirror Light" }, { "channelId": "CH2", "pinNo": 20, "mode": 1, "name": "Mirror Demister" }]
PORT=3000
```

### Run

```sh
sudo yarn start
```

## Endpoints

### GET /

Get details of all available relays.

### GET /sys-info

Get info about current system.

### GET /:id

Get details of a particular relay.

### POST /:id/on

Turn a relay on (digital write `1`).

### POST /:id/off

Turn a relay off (digital write `0`).

### POST /:id/toggle

Toggles a relay on and off (digital write `1` or `0`), inverting its previous state.

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
