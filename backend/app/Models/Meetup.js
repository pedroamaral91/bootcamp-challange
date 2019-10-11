'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Meetup extends Model {
  scheduling() {
    return this.belongsToMany('App/Models/User')
      .pivotTable('schedulings')
      .withTimestamps()
  }

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Meetup
