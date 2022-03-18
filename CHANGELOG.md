## 0.95.0

* Upgrade Hugo to 0.95.0 extended

## 0.93.0

* Upgrade Hugo to 0.93.0 extended

## 0.91.2

* Upgrade Hugo to 0.91.2 extended

## 0.90.1

* Upgrade Hugo to 0.90.1 extended

## 0.90.0

* Upgrade Hugo to 0.90.0 extended

## 0.89.4

* Upgrade Hugo to 0.89.4 extended

## 0.88.1 (2021-10-12)

* Upgrade Hugo to 0.88.1 extended

## 0.83.1 (2021-06-12)

* Upgrade Hugo to 0.83.1 extended
* More automation around packing/publish Hugo spk

## 0.79.1 (2020-12-22)

* Upgrade Hugo to 0.79.1 to deal with security issue

## 0.74.3 (2020-07-28)

* Upgrade Hugo to 0.74.3

## 0.69.0 (2020-04-21)

### Enhancements

* Upgrade Hugo to 0.69.0.
* Replace Caddy with [Cloud Commander](https://cloudcmd.io/) for
  web-based file management.
* Update NodeJS to 10 and `yarn upgrade` all transitive dependencies.

### Upgrade Notes

* If you use inline HTML in your Markdown, add the following to `config.toml`:

  ```
  [markup.goldmark.renderer]
  unsafe= true
  ```

## V0 (2016-10-10)

* Initial release.
