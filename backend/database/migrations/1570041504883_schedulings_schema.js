'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SchedulingsSchema extends Schema {
  up() {
    this.create('schedulings', table => {
      table.increments()
      table
        .integer('meetup_id')
        .unsigned()
        .index()
      table
        .foreign('meetup_id')
        .references('id')
        .inTable('meetups')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down() {
    this.drop('schedulings')
  }
}

module.exports = SchedulingsSchema
