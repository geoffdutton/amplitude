import { AxiosError } from 'axios'
import { AmplitudeResponseBody } from './responses'

export class AmplitudeErrorResponse extends Error {
  readonly status: number
  private data: object | string

  constructor(err: AxiosError) {
    super(err.message)
    this.status = err.response.status
    this.data = err.response.data
  }
}

export const axiosErrorCatcher = async (
  reqPromise: Promise<AmplitudeResponseBody>
): Promise<AmplitudeResponseBody> => {
  try {
    const res = await reqPromise
    return res
  } catch (err) {
    if (err.response) {
      throw new AmplitudeErrorResponse(err)
    }
    throw err
  }
}
