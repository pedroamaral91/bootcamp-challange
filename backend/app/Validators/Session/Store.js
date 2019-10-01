'use strict'

class SessionStore {
  get rules() {
    return {
      email: 'required|email',
      password: 'required',
    }
  }
}

module.exports = SessionStore
