/* eslint-disable camelcase */
const request = require('request-promise')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')

const isUrl = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/
const readFile = promisify(fs.readFile)

module.exports.uploadMessagePhoto = async (ctx, path, peerId) => {
  try {
    const { upload_url: uri } = await ctx.api.photos.getMessagesUploadServer({
      peer_id: peerId
    })

    const data = await request({
      method: 'POST',
      uri,
      formData: {
        photo: {
          value: isUrl.test(path)
            ? await request(path, { encoding: null })
            : await readFile(path),
          options: {
            filename: 'photo.jpg'
          }
        }
      }
    })

    return await ctx.api.photos.saveMessagesPhoto(JSON.parse(data))
  } catch (err) {
    throw err
  }
}
