'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const { test, trait, beforeEach } = use('Test/Suite')('Scheduling')
trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

trait(async suite => {
  const user = await Factory.model('App/Models/User').create()
  suite.Context.getter('user', () => user)
})

beforeEach(async () => {
  await Factory.model('App/Models/File').create()
  await Factory.model('App/Models/Meetup').create()
})

test('should schedule a meetup', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('/scheduling')
    .loginVia(user, 'jwt')
    .send({
      meetup_id: 1,
    })
    .end()
  response.assertStatus(201)
})

// test('should schedule fail if the user is the owner of meetup', async ({
//   client,
//   user,
// }) => {
//   const response = await client
//     .post('/scheduling')
//     .loginVia(user, 'jwt')
//     .send({
//       meetup_id: 2,
//     })
//     .end()
//   response.assertStatus(400)
//   response.assertText({
//     error: 'Náo é possível o organizador se inscrever no próprio evento.',
//   })
// })
