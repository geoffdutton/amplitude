import axios, { AxiosResponse } from 'axios'
import { AvailableCamelCaseToSnakeCasePropertyMap, StringMap } from './types'
import {
  AmplitudeOptions,
  AmplitudeRequestData,
  AmplitudeUserActivityOptions,
  AmplitudeExportOptions,
  AmplitudeRequestDataOptions,
  AmplitudeSegmentationOptions
} from './public'
import {
  AmplitudeTrackResponse,
  AmplitudeIdentifyResponse,
  AmplitudeUserSearchResponse,
  AmplitudeUserActivityResponse,
  AmplitudeResponseBody
} from './responses'
import { AmplitudePostRequestData } from './interfaces'
import { AmplitudeErrorResponse, axiosErrorCatcher } from './errors'

const AMPLITUDE_TOKEN_ENDPOINT = 'https://api.amplitude.com'
const AMPLITUDE_DASHBOARD_ENDPOINT = 'https://amplitude.com/api/2'
axios.defaults.headers.common['User-Agent'] = `amplitude/${
  require('../package').version
} node/${process.version} (${process.arch})`

const camelCaseToSnakeCasePropertyMap: {
  [key: string]: AvailableCamelCaseToSnakeCasePropertyMap
} = {
  userId: 'user_id',
  deviceId: 'device_id',
  sessionId: 'session_id',
  eventType: 'event_type',
  eventProperties: 'event_properties',
  userProperties: 'user_properties',
  appVersion: 'app_version',
  osName: 'os_name',
  osVersion: 'os_version',
  deviceBrand: 'device_brand',
  deviceManufacturer: 'device_manufacturer',
  deviceModel: 'device_model',
  locationLat: 'location_lat',
  locationLng: 'location_lng'
}

export default class Amplitude {
  private readonly token: string
  private readonly secretKey?: string
  private readonly userId?: string
  private readonly deviceId?: string
  private readonly sessionId?: string

  constructor(token: string, options: AmplitudeOptions = {}) {
    if (!token) {
      throw new Error('No token provided')
    }

    this.token = token
    this.secretKey = options.secretKey
    this.userId = options.userId || options.user_id
    this.deviceId = options.deviceId || options.device_id
    this.sessionId = options.sessionId || options.session_id
  }

  private _generateRequestData(
    data: AmplitudeRequestData | Array<AmplitudeRequestData>
  ): Array<AmplitudePostRequestData> {
    if (!Array.isArray(data)) {
      data = [data]
    }

    return data.map((item: AmplitudeRequestData) => {
      /* eslint-disable @typescript-eslint/camelcase */
      return Object.keys(item).reduce(
        (obj: AmplitudeRequestData, key: string) => {
          const transformedKey = camelCaseToSnakeCasePropertyMap[key] || key

          obj[transformedKey] = item[key]

          return obj
        },
        {
          event_type: item.event_type || item.eventType,
          device_id: item.device_id || this.deviceId,
          session_id: item.session_id || this.sessionId,
          user_id: item.user_id || this.userId
        } as AmplitudeRequestData
      )

      /* eslint-enable @typescript-eslint/camelcase */
    }) as [AmplitudePostRequestData]
  }

  identify(
    data: AmplitudeRequestData | [AmplitudeRequestData]
  ): Promise<AmplitudeIdentifyResponse> {
    const transformedData = this._generateRequestData(data)
    const params: StringMap = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      api_key: this.token,
      identification: JSON.stringify(transformedData)
    }

    const encodedParams = Object.keys(params)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
      })
      .join('&')

    return axiosErrorCatcher(
      axios
        .post(`${AMPLITUDE_TOKEN_ENDPOINT}/identify`, encodedParams, {
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          }
        })
        .then(res => res.data)
    ) as Promise<AmplitudeIdentifyResponse>
  }

  track(
    data: AmplitudeRequestData | Array<AmplitudeRequestData>,
    options?: AmplitudeRequestDataOptions
  ): Promise<AmplitudeTrackResponse> {
    const transformedData = this._generateRequestData(data)
    const params = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      api_key: this.token,
      events: transformedData,
      options
    }

    return axiosErrorCatcher(
      axios
        .post(`${AMPLITUDE_TOKEN_ENDPOINT}/2/httpapi`, params)
        .then(res => res.data)
    ) as Promise<AmplitudeTrackResponse>
  }

  async export(options: AmplitudeExportOptions): Promise<AxiosResponse> {
    try {
      if (!this.secretKey) {
        throw new Error('secretKey must be set to use the export method')
      }

      if (!options.start || !options.end) {
        throw new Error('`start` and `end` are required options')
      }

      const res = await axios.get(`${AMPLITUDE_DASHBOARD_ENDPOINT}/export`, {
        auth: {
          username: this.token,
          password: this.secretKey
        },
        params: {
          start: options.start,
          end: options.end
        }
      })

      return res
    } catch (err) {
      if (err.response) {
        throw new AmplitudeErrorResponse(err)
      }

      throw err
    }
  }

  userSearch(userSearchId: string): Promise<AmplitudeUserSearchResponse> {
    if (!this.secretKey) {
      throw new Error('secretKey must be set to use the userSearch method')
    }

    if (!userSearchId) {
      throw new Error('value to search for must be passed')
    }

    return axiosErrorCatcher(
      axios
        .get(`${AMPLITUDE_DASHBOARD_ENDPOINT}/usersearch`, {
          auth: {
            username: this.token,
            password: this.secretKey
          },
          params: {
            user: userSearchId
          }
        })
        .then(res => res.data)
    ) as Promise<AmplitudeUserSearchResponse>
  }

  userActivity(
    amplitudeId: string | number,
    params?: AmplitudeUserActivityOptions
  ): Promise<AmplitudeUserActivityResponse> {
    if (!params) {
      params = {
        user: amplitudeId
      }
    } else {
      params.user = amplitudeId
    }

    if (!this.secretKey) {
      throw new Error('secretKey must be set to use the userActivity method')
    }

    if (!amplitudeId) {
      throw new Error('Amplitude ID must be passed')
    }

    return axiosErrorCatcher(
      axios
        .get(`${AMPLITUDE_DASHBOARD_ENDPOINT}/useractivity`, {
          auth: {
            username: this.token,
            password: this.secretKey
          },
          params
        })
        .then(res => res.data)
    ) as Promise<AmplitudeUserActivityResponse>
  }

  eventSegmentation(
    params: AmplitudeSegmentationOptions
  ): Promise<AmplitudeResponseBody> {
    if (!this.secretKey) {
      throw new Error(
        'secretKey must be set to use the eventSegmentation method'
      )
    }

    if (!params || !params.e || !params.start || !params.end) {
      throw new Error('`e`, `start` and `end` are required data properties')
    }

    if (typeof params.e === 'object') {
      params.e = JSON.stringify(params.e)
    }

    return axiosErrorCatcher(
      axios
        .get(`${AMPLITUDE_DASHBOARD_ENDPOINT}/events/segmentation`, {
          auth: {
            username: this.token,
            password: this.secretKey
          },
          params
        })
        .then(res => res.data)
    )
  }
}
