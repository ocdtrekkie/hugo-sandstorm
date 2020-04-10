## V0 (2016-10-10)

* Initial release.

## 0.69.0 (2020-04-10)

The "I can't stand Hugo 0.20.something anymore" release.

### Enhancements

* Upgrade Hugo to 0.69.0
* Remove Caddy & admin interface for now
  * This never quite worked right for me and direct support for
    Hugo management was [dropped during Caddy 2 development](https://caddy.community/t/new-old-plugin-http-filebrowser/5103).
    Bringing back Caddy would require a bit more work than I'm able to put into
    it for this release.
* Update NodeJS to 10 and `yarn upgrade` all transitive dependencies

### Workarounds

* For some reason the `getPublicId` script causes some part of Cap'n Proto to
  crash the grain when executed, specifically as the script is exiting.
  I've tried everything I know to have it not do that, but ended up with a
  terrible workaround: capture the stdout of the script to a file as it
  executes and memoize the output based on the session ID parameter.
  For my single-person Sandstorm server, this seems fine. I would love help
  figuring this out.
