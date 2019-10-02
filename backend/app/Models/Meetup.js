'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Meetup extends Model {
  scheduling() {
    return this.hasOne('App/Models/Scheduling')
  }
}

module.exports = Meetup
