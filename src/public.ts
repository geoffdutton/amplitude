export interface AmplitudeOptions {
  secretKey?: string
  userId?: string
  deviceId?: string
  sessionId?: string

  user_id?: string
  device_id?: string
  session_id?: string
}

export interface AmplitudeRequestData {
  /**
   * 	A readable ID specified by you. Must have a minimum length of 5 characters.
   * 	Required unless device_id is present.
   */
  user_id?: string

  /**
   * A device-specific identifier, such as the Identifier for Vendor on iOS.
   * Required unless user_id is present. If a device_id is not sent with the event,
   * it will be set to a hashed version of the user_id.
   */
  device_id?: string

  /**
   * A unique identifier for your event. If you would like to make an Identify call,
   * please set "event_type" to $identify.
   */
  event_type?: string

  /**
   * The timestamp of the event in milliseconds since epoch. If time is not sent
   * with the event, it will be set to the request upload time.
   */
  time?: number

  /**
   * A dictionary of key-value pairs that represent additional data to be sent
   * along with the event. You can store property values in an array.
   * Date values are transformed into string values.
   */
  event_properties?: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * A dictionary of key-value pairs that represent additional data tied to the user.
   * You can store property values in an array.
   * Date values are transformed into string values.
   */
  user_properties?: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * The current version of your application.
   */
  app_version?: string

  /**
   * Platform of the device.
   */
  platform?: string

  /**
   * The name of the mobile operating system or browser that the user is using.
   */
  os_name?: string

  /**
   * The version of the mobile operating system or browser the user is using.
   */
  os_version?: string

  /**
   * The device brand that the user is using.
   */
  device_brand?: string

  /**
   * The device manufacturer that the user is using.
   */
  device_manufacturer?: string

  /**
   * The device model that the user is using.
   */
  device_model?: string

  /**
   * The carrier that the user is using.
   */
  carrier?: string

  /**
   * The current country of the user.
   */
  country?: string

  /**
   * The current region of the user.
   */
  region?: string

  /**
   * The current city of the user.
   */
  city?: string

  /**
   * The current Designated Market Area of the user.
   */
  dma?: string

  /**
   * The language set by the user.
   */
  language?: string

  /**
   * The price of the item purchased. Required for revenue data if the revenue
   * field is not sent. You can use negative values to indicate refunds.
   */
  price?: number

  /**
   * The quantity of the item purchased. Defaults to 1 if not specified.
   */
  quantity?: number

  /**
   * revneue = price * quantity. If you send all 3 fields of price, quantity,
   * and revenue, then (price * quantity) will be used as the revenue value.
   * You can use negative values to indicate refunds.
   */
  revenue?: number

  /**
   * An identifier for the item purchased. You must send a price and quantity
   * or revenue with this field.
   */
  productId?: string

  /**
   * The type of revenue for the item purchased. You must send a price and
   * quantity or revenue with this field.
   */
  revenueType?: string

  /**
   * The current Latitude of the user.
   */
  location_lat?: number

  /**
   * The current Longitude of the user.
   */
  location_lng?: number

  /**
   * The IP address of the user. Use "$remote" to use your server's IP address.
   * We will use the IP address to reverse lookup a user's location (city, country,
   * region, and DMA). Amplitude has the ability to drop the location and IP
   * address from events once it reaches our servers. You can submit a request to
   * our platform specialist team here <https://help.amplitude.com/hc/en-us/requests/new>
   * to configure this for you.
   */
  ip?: string

  /**
   * (iOS) Identifier for Advertiser.
   */
  idfa?: string

  /**
   * (iOS) Identifier for Vendor.
   */
  idfv?: string

  /**
   * (Android) Google Play Services advertising ID
   */
  adid?: string

  /**
   * (Android) Android ID (not the advertising ID)
   */
  android_id?: string

  /**
   * (Optional) An incrementing counter to distinguish events with the same user_id
   * and timestamp from each other. We recommend you send an event_id, increasing
   * over time, especially if you expect events to occur simultaneously.
   */
  event_id?: number

  /**
   * (Optional) The start time of the session in milliseconds since epoch (Unix
   * Timestamp), necessary if you want to associate events with a particular system.
   * A session_id of -1 is the same as no session_id specified.
   */
  session_id?: number

  /**
   * (Optional) A unique identifier for the event. We will deduplicate subsequent events
   * sent with an insert_id we have already seen before within the past 7 days. We
   * recommend generation a UUID or using some combination of device_id, user_id,
   * event_type, event_id, and time.
   */
  insert_id?: string

  /**
   * This feature is only available to Enterprise customers who have purchased the
   * Accounts add-on <https://help.amplitude.com/hc/en-us/articles/115001765532>.
   * This field adds a dictionary of key-value pairs that represent groups of users
   * to the event as an event-level group. You can only track up to 5 groups.
   */
  groups?: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any

  // Convenience for converting camelCase to snake_case
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface AmplitudeRequestDataOptions {
  /**
   * Minimum permitted length for user_id & device_id fields
   */
  min_id_length: number
}

export interface AmplitudeExportOptions {
  start: Date
  end: Date
}

export interface AmplitudeSegmentationOptions {
  start?: Date
  end?: Date
  e?: string | object
}

export interface AmplitudeUserActivityOptions {
  // Amplitude ID of the user
  user?: string | number
  // Zero-indexed offset to start returning events from.
  offset?: number
  // Limit on the number of events returned (up to 1000).
  limit?: number
}
