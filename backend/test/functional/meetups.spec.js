'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Meetups')
const { addDays, subDays } = require('date-fns')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

trait(async suite => {
  const user = await Factory.model('App/Models/User').create()
  suite.Context.getter('user', () => user)
})

const payload = {
  title: 'Vencendo a síndrome do impostor',
  description:
    'Venha aprender comigo como vencer a síndrome que eu não sei vencer :D',
  date: addDays(new Date(), 5),
  localization: 'Rua dos impostores, 123',
  user_id: 1,
  file_id: 1,
}

test('should user be able to register a meetup', async ({ client, user }) => {
  const response = await client
    .post('/meetup')
    .loginVia(user, 'jwt')
    .send(payload)
    .end()
  response.assertStatus(201)
  response.assertJSON({
    message: 'Dados cadastrados com sucesso!',
  })
})

test('should register fail if date is lower than now', async ({
  client,
  user,
}) => {
  const date = subDays(Date.now(), 3)
  const paylodWithWrongDate = { ...payload, date }

  const response = await client
    .post('/meetup')
    .loginVia(user, 'jwt')
    .send(paylodWithWrongDate)
    .end()

  response.assertStatus(422)
})

test('should update meetup', async ({ client, assert, user }) => {
  await Factory.model('App/Models/File').create()
  const meetup = await Factory.model('App/Models/Meetup').create({
    user_id: user.id,
  })
  const response = await client
    .put('/meetup/1')
    .loginVia(user, 'jwt')
    .send(payload)
    .end()
  response.assertStatus(204)
  const oldMeetup = meetup.toJSON()
  await meetup.reload()
  assert.notEqual(meetup.title, oldMeetup.title)
})

test('should update fail if user is not owner of the meetup', async ({
  client,
  user,
}) => {
  await Factory.model('App/Models/File').create()
  const newUser = await Factory.model('App/Models/User').create()
  await Factory.model('App/Models/Meetup').create({
    user_id: newUser.id,
  })
  const response = await client
    .put('/meetup/1')
    .loginVia(user, 'jwt')
    .send(payload)
    .end()
  response.assertStatus(400)
})

test('should list meetup just for user owner', async ({
  client,
  assert,
  user,
}) => {
  await Factory.model('App/Models/File').create()
  await Factory.model('App/Models/Meetup').createMany(3)
  const response = await client
    .get(`/meetup/${user.id}`)
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  response.body.meetup.map(meetup => {
    assert.equal(user.id, meetup.user_id)
  })
})

test('should delete fail if date is higher than today', async ({
  client,
  user,
}) => {
  await Factory.model('App/Models/File').create()
  await Factory.model('App/Models/Meetup').create({ user_id: user.id })
  const response = await client
    .delete('/meetup/1')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset({
    error: 'Meetup já ocorreu',
  })
})

test('should delete meetup', async ({ client, user }) => {
  await Factory.model('App/Models/File').create()
  await Factory.model('App/Models/Meetup').create({
    date: addDays(new Date(), 5),
    user_id: user.id,
  })
  const response = await client
    .delete('/meetup/1')
    .loginVia(user, 'jwt')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    message: 'Operação concluída com sucesso',
  })
})
