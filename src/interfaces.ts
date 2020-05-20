import { AmplitudeRequestData } from './public'

export interface AmplitudePostRequestData extends AmplitudeRequestData {
  user_id: string
  device_id: string
  sessions_id: string
}
