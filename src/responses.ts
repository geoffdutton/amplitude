export interface AmplitudeTrackResponse {
  code: number
  server_upload_time: number
  payload_size_bytes: number
  events_ingested: number
}

// It simply returns 'success'
export type AmplitudeIdentifyResponse = string

export interface AmplitudeUserSearchMatch {
  amplitude_id: number
  user_id: string
  last_seen?: string
}

export interface AmplitudeUserSearchResponse {
  matches: Array<AmplitudeUserSearchMatch>
  type: string
}

export interface AmplitudeUserActivityResponse {
  userData: {
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  events: Array<{
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }>
}

export type AmplitudeResponseBody =
  | AmplitudeTrackResponse
  | AmplitudeIdentifyResponse
  | AmplitudeUserSearchResponse
  | AmplitudeUserActivityResponse
