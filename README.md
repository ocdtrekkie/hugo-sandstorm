# Hugo Sandstorm package

This is the [Sandstorm](https://sandstorm.io) package of [Hugo](https://gohugo.io/).
The version of Hugo in this build is listed in `hugo-version`.

## Development

The package is built with [vagrant-spk](https://github.com/sandstorm-io/vagrant-spk),
a tool designed to help app developers package apps for [Sandstorm](https://sandstorm.io).

You can follow the below mentioned steps to make your own package or to contribute.

### Prerequisites

You will need to install:

* [Vagrant](https://www.vagrantup.com/)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* Git

## Step by Step

```
git clone https://github.com/sandstorm-io/vagrant-spk
git clone https://github.com/johnbintz/hugo-sandstorm
export PATH=$(pwd)/vagrant-spk:$PATH
cd hugo-sandstorm
bin/test_hugo
```
Visit [http://local.sandstorm.io:6090/](http://local.sandstorm.io:6090/) in a web browser.

Note: when you want to fork this repo and create actual app packages for the app
store you would need either the original app key or
[create a new one and make your own version of the app](https://docs.sandstorm.io/en/latest/developing/publishing-apps/).

## Upgrades

* You'll need Ruby 2.6 and `gem install httparty`.
* Run `bin/upgrade_hugo <new version>`.
* Follow the directions.

## Pack and publish

* Run `bin/pack_hugo` to create an spk in the parent directory to ths one
* Try loading that spk into a separate Sandstorm instance for testing
* If it works, run `bin/publish_hugo` to publish that version to the App Market

