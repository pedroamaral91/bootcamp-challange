'use strict'

class UserUpdate {
  get rules() {
    return {
      password: 'required|confirmed',
    }
  }
}

module.exports = UserUpdate
