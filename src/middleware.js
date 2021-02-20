const request = require('request-promise')
const debug = require('debug')('botkit:rasa')

module.exports = config => {
  if (!config) {
    config = {}
  }

  if (!config.rasa_uri) {
    config.rasa_uri = 'http://localhost:5000'
  }

  var middleware = {
    receive: (bot, message, next) => {
      if (!message.text || message.is_echo) {
        next()
        return
      }

      debug('Sending message to Rasa', message.text)
      const options = {
        method: 'POST',
        uri: `${config.rasa_uri}/webhooks/rest/webhook`,
        body: {
          sender: message.user
          message: message.text
        },
        json: true
      }

      request(options)
        .then(response => {
          debug('Rasa response', response)
          message.response = response[0]
          next()
        })
    },

  }
  return middleware
}
