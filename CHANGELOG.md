# Amplitude Change Log

## v5.0.2
- Convert to typescript (this shouldn't break anything as it's being exported just like before)
- Implement the [Amplitude HTTP V2 API](https://developers.amplitude.com/docs/http-api-v2)

**IMPORTANT**: There aren't any breaking changes in the code, but the Amplitude V2 API has a few stricter validations server side. For example, in one project where I was using this, I was passing a timestamp generated from Swift, so it was a float. However, the [time](https://developers.amplitude.com/docs/http-api-v2#parameters) param only allows type of `long`, i.e. `integer`.

## v4.0.3
- Update README

## v4.0.1
- Changes maintainer

## Previous Releases
See the releases from the original repo: [crookedneighbor/amplitude](https://github.com/crookedneighbor/amplitude/releases)
