'use strict'

class UserStore {
  get rules() {
    return {
      username: 'required',
      email: 'required|email|unique:users',
      password: 'required|confirmed',
    }
  }

  get messages() {
    return {
      'email.unique': 'Email já cadastrado',
    }
  }
}

module.exports = UserStore
