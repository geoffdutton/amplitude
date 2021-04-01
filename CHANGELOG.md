# Amplitude Change Log

## v5.1.5
- Security update for `y18n` 

## v5.1.4
- Update `axios` to latest to fix the issue of missing `ProgressEvent` when using Typescript

## v5.1.3

- Update `axios` and `node-fetch`

## v5.1.2

- Add LICENSE file
- Update devDependencies
- Use `unknown` in place of `object | string`

## v5.1.1

As of 2020-05-30, Amplitude reported issues with their SSL certificate, so they set up an endpoint and alternate endpoint at `https://api2.amplitude.com`. Read about it on [Amplitude's Status Page](https://status.amplitude.com/incidents/lf2pwqnyrn6s) and affected devices [here](https://calnetweb.berkeley.edu/calnet-technologists/incommon-sectigo-certificate-service/addtrust-external-root-expiration-may-2020).

- Add option to set token endpoint via an environment variable, i.e. `AMPLITUDE_TOKEN_ENDPOINT="https://api2.amplitude.com"`
- Add option to set token endpoint via constructor options, i.e. `https://api2.amplitude.com`

## v5.0.2

- Convert to typescript (this shouldn't break anything as it's being exported just like before)
- Implement the [Amplitude HTTP V2 API](https://developers.amplitude.com/docs/http-api-v2)

**IMPORTANT**: There aren't any breaking changes in the code, but the Amplitude V2 API has a few stricter validations server side. For example, in one project where I was using this, I was passing a timestamp generated from Swift, so it was a float. However, the [time](https://developers.amplitude.com/docs/http-api-v2#parameters) param only allows type of `long`, i.e. `integer`.

From Amplitude's docs:

> - Validation on Content-type header (must be set to application/json)
> - Validation on proper JSON request body
> - Validation on event_type name (cannot be event names that are reserved for Amplitude use)
> - Validation on device_id length (must be 5 or more characters unless overrided with min_id_length)
> - Validation on user_id length (must be 5 or more characters unless overrided with min_id_length)
> - Validation on time field in event payload (must be number of milliseconds since the start of epoch time)

## v4.0.3

- Update README

## v4.0.1

- Changes maintainer

## Previous Releases

See the releases from the original repo: [crookedneighbor/amplitude](https://github.com/crookedneighbor/amplitude/releases)
