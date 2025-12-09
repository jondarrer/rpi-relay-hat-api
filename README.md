# rpi-relay-hat-api <!-- omit in toc -->

- [Install dependencies (on Raspberry Pi only)](#install-dependencies-on-raspberry-pi-only)
  - [Install pigpio](#install-pigpio)
  - [Symlink node, npm \& yarn](#symlink-node-npm--yarn)
- [Install and run the package](#install-and-run-the-package)
  - [Configure the application](#configure-the-application)
  - [Run the package](#run-the-package)
- [Development options](#development-options)
  - [Download the package](#download-the-package)
  - [Build application](#build-application)
  - [Configure the application for development](#configure-the-application-for-development)
  - [Run](#run)
  - [Test](#test)
  - [Publish](#publish)
- [Endpoints](#endpoints)
  - [GET /](#get-)
  - [GET /sys-info](#get-sys-info)
  - [GET /:id](#get-id)
  - [POST /:id/on](#post-idon)
  - [POST /:id/off](#post-idoff)
  - [POST /:id/toggle](#post-idtoggle)
- [Managed process](#managed-process)
  - [Install pm2](#install-pm2)
  - [Add process to startup script](#add-process-to-startup-script)

An API to control the [Waveshare RPi Relay Board](https://www.waveshare.com/wiki/RPi_Relay_Board).

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

Create a rpi-relay-hat-api.env file (in a globally accessible location will allow it to be run as a service, e.g. within /usr/lib/node_modules/rpi-relay-hat-api/) and add details of the channels and server port, something like:

```sh
RELAY_HAT_CHANNELS=[{ "channelId": "CH1", "pinNo": 26, "mode": 1, "name": "Mirror Light" }, { "channelId": "CH2", "pinNo": 20, "mode": 1, "name": "Mirror Demister" }]
PORT=3000
```

| Property | Type | Meaning | Example |
|----------|------|---------|---------|
| channelId | string | Unique identifier in the format CH{n}, where n is a number between 1 and 9 | CH1 |
| pinNo | number | BCM pin number, as per [RPi Relay Board - Interface description](https://www.waveshare.com/wiki/RPi_Relay_Board#Interface_description) | 20, 21, or 26 |
| mode | number | Default value, 0 for off and 1 for on | 0 or 1 |
| name | string | The display name for the switch | Mirror Light |

### Run the package

```sh
ENV_FILE_PATH=/usr/lib/node_modules/rpi-relay-hat-api/rpi-relay-hat-api.env rpi-relay-hat-api
```

## Development options

Rather than installing the package, these development options allow it to be run and tested:

### Download the package

```sh
git clone git@github.com:jondarrer/rpi-relay-hat-api
cd rpi-relay-hat-api
```

### Build application

```sh
yarn
yarn build
```

### Configure the application for development

Create a .env file and add details of the channels and server port, something like:

```sh
RELAY_HAT_CHANNELS=[{ "channelId": "CH1", "pinNo": 26, "mode": 1, "name": "Mirror Light" }, { "channelId": "CH2", "pinNo": 20, "mode": 1, "name": "Mirror Demister" }]
PORT=3000
```

### Run

```sh
sudo yarn start
```

### Test

```sh
yarn test
```

### Publish

```sh
npm version patch -m "%s"
git push && git push --tags
```

And then create a release based on the tag in GitHub; this will then run the GitHub action to publish the package on [npmjs.com](https://www.npmjs.com/package/rpi-relay-hat-api).

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
