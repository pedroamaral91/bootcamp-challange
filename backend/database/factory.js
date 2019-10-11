'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const { format } = use('date-fns')

Factory.blueprint('App/Models/User', async faker => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: 'secret',
  }
})

Factory.blueprint('App/Models/File', async faker => {
  return {
    file: faker.name(),
    name: 'teste.jpg',
    type: 'jpg',
    subType: 'jpg',
  }
})

Factory.blueprint('App/Models/Meetup', async (faker, i, data) => {
  return {
    title: faker.word({ length: 5 }),
    description: faker.sentence(),
    localization: faker.string(),
    date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    user_id: 1,
    file_id: 1,
    ...data,
  }
})

Factory.blueprint('App/Models/Scheduling', async (faker, i, data) => {
  return {
    user_id: 1,
    meetup_id: 1,
    ...data,
  }
})
