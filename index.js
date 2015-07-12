#!/usr/bin/env node

var Yousee = require('yousee')
var inquirer = require('inquirer')
var spawn = require('child_process').spawn

process.title = 'youseecast'

var client = new Yousee()
var req = client.livetv.allowed_channels.get().then(function (data) {

  var channels = data.body

  inquirer.prompt([{
    name: 'channel',
    type: 'list',
    message: 'Please choose a channel',
    choices: channels.map(function (channel) {
      return {
        name: channel.nicename,
        value: channel
      }
    })
  }], function (answers) {

    var options = []
    var channel = answers.channel

    client.livetv.streamurl.get({
      channel_id: channel.id,
      client: 'http',
      application: 'chromecast'
    }).then(function (data) {
      var streamUrl = data.body.url
      console.log('.. stream found', streamUrl)
      console.log('.. booting castnow')
      return spawn('node_modules/castnow/index.js', [streamUrl].concat(options), { stdio: 'inherit' })
    }).catch(function (err) {
      console.error('err', err)
    })

  })
})

req.catch(function (err) {
  console.error('err', err)
})
