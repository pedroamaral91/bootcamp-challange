'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupSchema extends Schema {
  up() {
    this.create('meetups', table => {
      table.increments()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('localization').notNullable()
      table.timestamp('date').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .index()
      table
        .foreign('user_id')
        .references('id')
        .on('users')
        .onDelete('CASCADE')
      table
        .integer('file_id')
        .unsigned()
        .index()
      table
        .foreign('file_id')
        .references('id')
        .on('files')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down() {
    this.drop('meetups')
  }
}

module.exports = MeetupSchema
