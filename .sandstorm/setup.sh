#!/bin/bash

# When you change this file, you must take manual action. Read this doc:
# - https://docs.sandstorm.io/en/latest/vagrant-spk/customizing/#setupsh

set -euo pipefail

export HUGO_VERSION=$(cat /opt/app/hugo-version)
export NODE_VERSION=$(cat /opt/app/.nvmrc)

apt-get update
apt-get install -y git
apt-get install -y g++ autoconf pkg-config libtool
# First, get capnproto from master and install it to
# /usr/local/bin. This requires a C++ compiler. clang wasn't working
# well with building getPublicId so I switched to g++.
if [ ! -e /usr/local/bin/capnp ] ; then
    cd /tmp
    if [ ! -e capnproto ]; then git clone https://github.com/capnproto/capnproto; fi
    cd capnproto
    git checkout master
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

curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
apt-get install -y nodejs
npm install -g yarn

apt-get install -y python-pip asciidoctor
pip install pygments

cd /tmp
wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.deb -O hugo.deb
dpkg -i hugo.deb
rm hugo.deb
