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

## Run

```sh
sudo yarn start
```
