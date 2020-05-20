const Amplitude = require('../src').default
const nock = require('nock')

function generateMockedRequest(query, status) {
  return nock('https://amplitude.com')
    .defaultReplyHeaders({ 'Content-Type': 'application/zip' })
    .get('/api/2/export')
    .query(query)
    .basicAuth({
      user: 'token',
      pass: 'key'
    })
    .reply(status)
}

describe('export', () => {
  let amplitude
  let options

  beforeEach(() => {
    amplitude = new Amplitude('token', {
      secretKey: 'key'
    })
    options = {
      start: '20160523T20',
      end: '20160525T20'
    }
  })

  it('throws an error if secret key is missing', async () => {
    amplitude.secretKey = undefined

    let err
    try {
      await amplitude.export(options)
    } catch (e) {
      err = e
    }

    expect(err.message).to.eq('secretKey must be set to use the export method')
  })

  it('throws an error if start param is missing', async () => {
    delete options.start

    let err
    try {
      await amplitude.export(options)
    } catch (e) {
      err = e
    }

    expect(err.message).to.eq('`start` and `end` are required options')
  })

  it('throws an error if end param is missing', async () => {
    delete options.end

    let err
    try {
      await amplitude.export(options)
    } catch (e) {
      err = e
    }

    expect(err.message).to.eq('`start` and `end` are required options')
  })

  it('resolves a zip when succesful', () => {
    const mockedRequest = generateMockedRequest(options, 200)

    return amplitude.export(options).then(res => {
      expect(res.headers['content-type']).to.eql('application/zip')
      mockedRequest.done()
    })
  })

  it('rejects with error when unsuccesful', () => {
    const mockedRequest = generateMockedRequest(options, 403)

    return amplitude
      .export(options)
      .then(res => {
        expect(res).not.to.exist
        throw new Error('Should not have resolved')
      })
      .catch(err => {
        expect(err.status).to.eq(403)
        mockedRequest.done()
      })
  })
})
