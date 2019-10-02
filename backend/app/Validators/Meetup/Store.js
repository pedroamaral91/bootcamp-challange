'use strict'

class MeetupStore {
  get rules() {
    return {
      title: 'string|required',
      description: 'string|required',
      localization: 'string|required',
      date: `date|after:${new Date()}|required`,
      file_id: 'number|required',
      user_id: 'number|required',
    }
  }
}

module.exports = MeetupStore
