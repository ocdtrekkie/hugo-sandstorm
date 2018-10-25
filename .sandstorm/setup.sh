#!/bin/bash

# When you change this file, you must take manual action. Read this doc:
# - https://docs.sandstorm.io/en/latest/vagrant-spk/customizing/#setupsh

set -euo pipefail

apt-get update
apt-get install -y git

# First, get capnproto from master and install it to
# /usr/local/bin. This requires a C++ compiler. We opt for clang
# because that's what Sandstorm is typically compiled with.
if [ ! -e /usr/local/bin/capnp ] ; then
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q clang autoconf pkg-config libtool
    cd /tmp
    if [ ! -e capnproto ]; then git clone https://github.com/sandstorm-io/capnproto; fi
    cd capnproto
    git checkout f73ac9f6667d7b87c395d23f3753dde63937cf00
    cd c++
    autoreconf -i
    ./configure
    make -j2
    sudo make install
fi

# Second, compile the small C++ program within
# /opt/app/sandstorm-integration.
if [ ! -e /opt/app/sandstorm-integration/getPublicId ] ; then
    pushd /opt/app/sandstorm-integration
    make
fi

cp /opt/app/sandstorm-integration/bin/getPublicId /usr/local/bin

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
apt-get install -y nodejs
npm install -g yarn

apt-get install -y python-pip asciidoctor
pip install pygments

cd /tmp
wget https://github.com/gohugoio/hugo/releases/download/v0.49.2/hugo_0.49.2_Linux-64bit.deb -O hugo.deb
dpkg -i hugo.deb
rm hugo.deb
# cd /tmp
# wget https://storage.googleapis.com/golang/go1.8.linux-amd64.tar.gz -O go.tar.gz
# tar xfz go.tar.gz
# mv go /usr/local
# rm go.tar.gz
wget "https://caddyserver.com/download/build?os=linux&arch=amd64&features=filemanager%2Chugo" -O /tmp/caddy.tar.gz
cd /tmp
tar xfz caddy.tar.gz
mv caddy /usr/local/bin
rm caddy.tar.gz
