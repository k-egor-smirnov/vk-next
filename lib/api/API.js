const bindMethods = require('./bindMethods')
const request = require('./request')
const users = require('./methods/Users')
const auth = require('./methods/Auth')
const wall = require('./methods/Wall')
const photos = require('./methods/Photos')
const friends = require('./methods/Friends')
const widgets = require('./methods/Widgets')
const secure = require('./methods/Secure')
const streaming = require('./methods/Streaming')
const storage = require('./methods/Storage')
const orders = require('./methods/Orders')
const status = require('./methods/Status')
const leads = require('./methods/Leads')
const pages = require('./methods/Pages')
const groups = require('./methods/Groups')
const board = require('./methods/Board')
const video = require('./methods/Video')
const notes = require('./methods/Notes')
const places = require('./methods/Places')
const account = require('./methods/Account')
const messages = require('./methods/Messages')
const newsfeed = require('./methods/Newsfeed')
const likes = require('./methods/Likes')
const polls = require('./methods/Polls')
const docs = require('./methods/Docs')
const fave = require('./methods/Fave')
const notifications = require('./methods/Notifications')
const stats = require('./methods/Stats')
const search = require('./methods/Search')
const apps = require('./methods/Apps')
const utils = require('./methods/Utils')
const database = require('./methods/Database')
const gifts = require('./methods/Gifts')
const ads = require('./methods/Ads')
const market = require('./methods/Market')

class API {
  constructor (token) {
    this.token = token
    this.users = users
    this.auth = auth
    this.wall = wall
    this.photos = photos
    this.friends = friends
    this.widgets = widgets
    this.secure = secure
    this.streaming = streaming
    this.storage = storage
    this.orders = orders
    this.status = status
    this.leads = leads
    this.pages = pages
    this.groups = groups
    this.board = board
    this.video = video
    this.notes = notes
    this.places = places
    this.account = account
    this.messages = messages
    this.newsfeed = newsfeed
    this.likes = likes
    this.polls = polls
    this.docs = docs
    this.fave = fave
    this.notifications = notifications
    this.stats = stats
    this.search = search
    this.apps = apps
    this.utils = utils
    this.database = database
    this.gifts = gifts
    this.ads = ads
    this.market = market
  }

  init () {
    for (let category of Object.keys(this)) {
      if (category !== "token") {
        this[category] = bindMethods.call(this, this[category])
      }
    }
  }

  _call (...params) {
    return request.call(this, ...params)
  }
}

module.exports = API
