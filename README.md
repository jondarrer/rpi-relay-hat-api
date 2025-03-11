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
RELAY_HAT_CHANNELS=[{ "channelId": "CH1", "pinNo": 26, "mode": 1, "name": "Light 1" }, { "channelId": "CH2", "pinNo": 20, "mode": 1, "name": "Light 2" }, { "channelId": "CH3", "pinNo": 21, "mode": 1, "name": "Light 3" }]
PORT=3000
```

## Run

```sh
sudo yarn start
```

## Test

```sh
yarn test
```
