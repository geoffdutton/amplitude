# amplitude

![Build Status](https://travis-ci.org/geoffdutton/amplitude.svg?branch=master) ![npm version](https://badge.fury.io/js/amplitude.svg) [![Known Vulnerabilities](https://snyk.io/test/github/geoffdutton/amplitude/badge.svg?targetFile=package.json)](https://snyk.io/test/github/geoffdutton/amplitude?targetFile=package.json)

Server side implementation of [Amplitude](https://amplitude.com)'s HTTP API.

## Amplitude SSL Issue
As of 2020-05-30, Amplitude reported issues with their SSL certificate, so they set up an endpoint and alternate endpoint at `https://api2.amplitude.com`. Read about it on [Amplitude's Status Page](https://status.amplitude.com/incidents/lf2pwqnyrn6s) and affected devices [here](https://calnetweb.berkeley.edu/calnet-technologists/incommon-sectigo-certificate-service/addtrust-external-root-expiration-may-2020).

As of v5.1.0+, you can use the alternative endpoint by setting the environment variable:
```bash
AMPLITUDE_TOKEN_ENDPOINT = 'https://api2.amplitude.com'
```

Or in the constructor:
```javascript
const amplitude = new Amplitude('api-token', {
  tokenEndpoint: 'https://api2.amplitude.com'
})
```

## Version 5+ Note ##
For amplitude@5+, it uses Amplitude's [V2 HTTP API](https://help.amplitude.com/hc/en-us/articles/360032842391-HTTP-API-V2), which replaces the deprecated [V1 HTTP API](https://help.amplitude.com/hc/en-us/articles/204771828-HTTP-API-Deprecated-). This only affects the [`.track` method](#track-an-event). The only potential breaking change is by default `user_id` and `device_id` require a minimum of 5 characters.

## Install

```bash
npm install amplitude --save
```

## Basic Initialization

```javascript
const Amplitude = require('amplitude')
// The only required field is the api token
const amplitude = new Amplitude('api-token')
```

See the [`examples/`](/examples) directory for further usage.

## Track an event

Pass in any keys listed on the [Amplitude V2 HTTP API](https://help.amplitude.com/hc/en-us/articles/360032842391-HTTP-API-V2). The only required keys are `event_type` and either `user_id` or `device_id`. If you initialized the Amplitude object with a user/device id, they can be ignored when calling the track method. Note: the `user_id` and `device_id` must be 5 or more characters if passed.

```javascript
const data = {
  event_type: 'some value', // required
  user_id: 'some-user-id', // only required if device id is not passed in
  device_id: 'some-device-id', // only required if user id is not passed in
  session_id: 1492789357923, // must be unix timestamp in ms, not required
  event_properties: {
    //...
  },
  user_properties: {
    //...
  }
}
try {
  await amplitude.track(data)
} catch (err) {
  console.error(err)
}
```

You can also pass an array of `event` objects:
```javascript
const data = [
  {
    event_type: 'some value', // required
    user_id: 'some id', // only required if device id is not passed in
    device_id: 'some id', // only required if user id is not passed in
    event_properties: {
      //...
    },
    user_properties: {
      //...
    }
  },
  {
    event_type: 'another value', // required
    user_id: 'some id', // only required if device id is not passed in
    device_id: 'some id', // only required if user id is not passed in
    event_properties: {
      //...
    },
    user_properties: {
      //...
    }
  }
]
amplitude.track(data)
    .then(res => {
      console.log('Amplitude response', res)
    })
```

## Identify API

The `identify` method allows you to [make changes to a user without sending an analytics event](https://amplitude.zendesk.com/hc/en-us/articles/205406617). 

```javascript
const data = {
  user_id: 'some id', // only required if device id is not passed in
  device_id: 'some id', // only required if user id is not passed in
  event_properties: {
    //...
  },
  user_properties: {
    //...
  }
}
amplitude.identify(data)
    .then(res => {
      console.log('Amplitude response', res)
    })
```

You can also pass an array of `identify` objects:
```javascript
const data = [
  {
    user_id: 'some id', // only required if device id is not passed in
    device_id: 'some id', // only required if user id is not passed in
    event_properties: {
      //...
    },
    user_properties: {
      //...
    }
  },
  {
    user_id: 'some id', // only required if device id is not passed in
    device_id: 'some id', // only required if user id is not passed in
    event_properties: {
      //...
    },
    user_properties: {
      //...
    }
  }
]
amplitude.identify(data)
    .then(res => {
      console.log('Amplitude response', res)
    })
```

With this method, you can also [modify user properties using property operations](https://amplitude.zendesk.com/hc/en-us/articles/205406617-Identify-API-Modify-User-Properties#keys-for-the-identification-argument). 

```javascript
const data = {
  user_id: 'some id', // only required if device id is not passed in
  device_id: 'some id', // only required if user id is not passed in
  user_properties: {
    $set: {
      //...
    },
    $add: {
      //...
    },
    $append: {
      //...
    }
  }
}
amplitude.identify(data)
    .then(res => {
      console.log('Amplitude response', res)
    })
```

Note the limitation of mixing user property operations with top level properties. If you use any property operations (`$add`, `$append`, etc.), and you want to set a user property, it must be done using the `$set` operation.

### CamelCase Data

If you prefer camelCase variables, you can pass in the camelCase version instead to the `track` and `identify` methods:

```javascript
const data = {
  eventType: 'some value', // required
  userId: 'some id', // only required if device id is not passed in
  deviceId: 'some id', // only required if user id is not passed in
  sessionId: 1492789357923, // must be unix timestamp in ms, not required
  eventProperties: {
    //...
  },
  userProperties: {
    //...
  }
}
amplitude.track(data)
    .then(res => {
      console.log('Amplitude response', res)
    })
```

This is the full list of properties that will be automatically transformed:

```
userId -> user_id
deviceId -> device_id
sessionId -> session_id
eventType -> event_type
eventProperties -> event_properties
userProperties -> user_properties
appVersion -> app_version
osName -> os_name
osVersion -> os_version
deviceBrand -> device_brand
deviceManufacturer -> device_manufacturer
deviceModel -> device_model
locationLat -> location_lat
locationLng -> location_lng
```

### User/Device/Session ID

If the user/device/session id will always be the same, you can initialize the object with it. Passing a user id or device id in the `track` and `identify` methods will override the default value set at initialization.

```javascript
const amplitude = new Amplitude('api-token', { user_id: 'some-user-id' })
// or
const amplitude = new Amplitude('api-token', { device_id: 'some-device-id' })
// or
const amplitude = new Amplitude('api-token', { session_id: 1492789357923 })

try {
    await amplitude.track({
      event_type: 'some value'
    })
} catch (err) {
  console.error(err)
}

// Or...

amplitude.track({
  event_type: 'some value',
  user_id: 'will-override-the-default-id'
})
    .then(res => {
      console.log('Amplitude response', res)
    })
```

### Promises

All methods return a Promise.

```javascript
amplitude.track(data)
  .then(function(result) {
    //... do something
  }).catch(function(error) {
    //... do something
  })

// Or..
try {
    const result = await amplitude.track({
      event_type: 'some value'
    })
    //... do something with result
} catch (error) {
    console.error(error)
    //... do something with the error
}
```

## Dashboard API

### Export your data

The export method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [export api](https://amplitude.zendesk.com/hc/en-us/articles/205406637-Export-API-Export-your-app-s-event-data) and requires a start and end string in the format `YYYYMMDDTHH`.

The method returns a stream.

```javascript
const fs = require('fs')
const stream = fs.createWriteStream('./may-2016-export.zip')

const amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.export({
  start: '20160501T20',
  end: '20160601T20'
}).pipe(stream)
```

### User Search

The user search method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [dashboard api](https://amplitude.zendesk.com/hc/en-us/articles/205469748-Dashboard-Rest-API-Export-Amplitude-Dashboard-Data#user%20search).

Search for a user with a specified Amplitude ID, Device ID, User ID, or User ID prefix.

```javascript
const amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.userSearch('user/device/amplitude id or user id prefix').then(res => {
  const matches = res.matches // Array of matches

  // How the match was made
  // If exact match was made with user id or device id, type === 'match_user_or_device_id'
  // If exact match was made with Amplitude ID, type === 'match_amplitude_id'
  // If a partial match was made with a user id prefix, type === 'match_user_prefix'
  // If no match was made, type === 'nomatch'
  const type = res.type
})
```

### User Activity

The user activity method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [dashboard api](https://amplitude.zendesk.com/hc/en-us/articles/205469748-Dashboard-Rest-API-Export-Amplitude-Dashboard-Data#user-activity).

Get a user summary and their recent events. This method requires an Amplitude ID. You can use the [user search](#user-search) method to find that.

```javascript
const amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.userActivity('Amplitude ID').then(function (res) {
  const userData = res.userData // data about the user
  const events = res.events // an array of events associated with the user
})
```

If there is nothing found for the passed Amplitude ID, the Promise will still resolve. The `userData` object will contain empty values and the `events` array will be empty:

```javascript
{
  userData: {
    num_sessions: 0,
    purchases: 0,
    revenue: 0,
    merged_amplitude_ids: [],
    num_events: 0,
    canonical_amplitude_id: 1,
    user_id: null,
    last_location: null,
    usage_time: 0,
    last_device_id: null,
    device_ids: []
  },
  events: []
}
```

If you do not know the Amplitude ID, you can use the [userSearch](#user-search) method to find it.

```javascript
const amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.userSearch('user-id').then(function (res) {
  // If you're using a prefix, you may get multiple matches and
  // you may need to handle the case where there is not a match
  const match = res.matches[0]

  return amplitude.userActivity(match.amplitude_id)
}).then(function (res) {
  const userData = res.userData // data about the user
  const events = res.events // an array of events associated with the user
})
```

### Event Segmentation

The event segmentation method requires your [secret key](https://amplitude.zendesk.com/hc/en-us/articles/206728448-Where-can-I-find-my-app-s-API-Key-or-Secret-Key-) to be added when initializing the amplitude object. This method uses the [dashboard api](https://amplitude.zendesk.com/hc/en-us/articles/205469748-Dashboard-Rest-API-Export-Amplitude-Dashboard-Data#event-segmentation).

Get metrics for an event with segmentation.

```javascript
const amplitude = new Amplitude('api-token', { secretKey: 'secret' })

amplitude.eventSegmentation({
  e: {
    'event_type': 'event_name'
  },
  start: '20170104',
  end: '20170117',
})
.then((res) => {
  const segmentationData = res.data
})
```

Example response:

```javascript
{ series: [ [ 2, 25, 3, 1, 0, 0, 2, 3, 5, 1, 0, 0, 0, 0 ] ],
  seriesLabels: [ 0 ],
  xValues: 
   [ '2017-01-04',
     '2017-01-05',
     '2017-01-06',
     '2017-01-07',
     '2017-01-08',
     '2017-01-09',
     '2017-01-10',
     '2017-01-11',
     '2017-01-12',
     '2017-01-13',
     '2017-01-14',
     '2017-01-15',
     '2017-01-16',
     '2017-01-17' ] }
```

If the event does not exist, Amplitude will throw a 400 error.

## Changelog

View the [CHANGELOG](/CHANGELOG.md) for changes in each version.

<!---
Do not change anything below this comment. It is generated automatically.
------>

## Contributors

+ [Erki Esken](http://deekit.net/)
+ [Matthew Keesan](http://keesan.net)
+ [Geoff Dutton](https://github.com/geoffdutton)
+ Matt Pardee
+ [Chase Seibert](http://chase-seibert.github.io/blog/)
