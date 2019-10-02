'use strict'

class MeetupUpdate {
  get rules() {
    return {
      title: 'string',
      description: 'string',
      localization: 'string',
      date: `date|after:${new Date()}`,
    }
  }
}

module.exports = MeetupUpdate
