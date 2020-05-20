require('dotenv').config()
const Amplitude = require('amplitude')

const apiKey = process.env.AMPLITUDE_API_KEY
const secretKey = process.env.AMPLITUDE_SECRET_KEY

;(async function () {
  try {
    const testUserId = 'test-user-id'
    const amp = new Amplitude(apiKey, {
      secretKey
    });
    const trackRes = await amp.track({
      user_id: testUserId,
      event_type: 'Amplitude Example'
    })
    console.log('Amplitude Track response', trackRes)

    const identifyRes = await amp.identify({
      userId: testUserId,
      userProperties: {
        '$setOnce': { 'First Identified Date': new Date() },
        'Is Testing': true
      }
    })
    console.log('Amplitude Identify response', identifyRes)

    const userSearchRes = await amp.userSearch(testUserId)
    console.log('User Search response', userSearchRes)

    const amplitudeId = userSearchRes.matches[0].amplitude_id

    const userActivityRes = await amp.userActivity(amplitudeId)
    console.log('User Activity response', {
      userData: userActivityRes.userData,
      event0: userActivityRes.events[0]
    })

  } catch (e) {
    console.error(e)
  }
})()
