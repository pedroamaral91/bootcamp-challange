'use strict'

const { format, addDays, parseISO } = use('date-fns')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Scheduling')
const Mail = use('Mail')
trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

beforeEach(() => {
  Mail.fake()
})

afterEach(() => {
  Mail.restore()
})

test('should schedule a meetup and send email to user', async ({
  client,
  assert,
}) => {
  const user = await Factory.model('App/Models/User').createMany(2)
  const meetup = await Factory.model('App/Models/Meetup').make()
  user[0].meetups().save(meetup)

  const response = await client
    .post('/scheduling')
    .loginVia(user[1], 'jwt')
    .send({
      meetup_id: 1,
    })
    .end()

  response.assertStatus(201)

  const recentEmail = Mail.pullRecent()
  assert.equal(recentEmail.message.to[0].address, user[1].email)
})

test('should schedule fail if the user is the owner of meetup', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').create()
  const meetup = await Factory.model('App/Models/Meetup').make()
  user.meetups().save(meetup)

  const response = await client
    .post('/scheduling')
    .loginVia(user, 'jwt')
    .send({
      meetup_id: 1,
    })
    .end()
  response.assertStatus(400)
  response.assertJSON({
    error: 'Não é possível o organizador se inscrever no próprio evento.',
  })
})

test('should schedule fail if meetup has already happened', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').createMany(2)
  const meetup = await Factory.model('App/Models/Meetup').make()
  user[0].meetups().save(meetup)
  await sleep(1000)
  const response = await client
    .post('/scheduling')
    .loginVia(user[1], 'jwt')
    .send({ meetup_id: 1 })
    .end()

  response.assertStatus(400)
}).timeout(0)

test('should schedule fail if user has already scheduled for this event', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').createMany(2)
  await Factory.model('App/Models/Meetup').create()
  await Factory.model('App/Models/Scheduling').create({ user_id: 2 })

  const response = await client
    .post('/scheduling')
    .loginVia(user[1], 'jwt')
    .send({ meetup_id: 1 })
    .end()

  response.assertStatus(400)
  response.assertJSON({
    error: 'Usuário já cadastrado para esse evento',
  })
})

test('should schedule fail if user has already scheduled on another meetup in the same hour', async ({
  client,
}) => {
  const user = await Factory.model('App/Models/User').createMany(2)
  await Factory.model('App/Models/Meetup').create({ user_id: user[1].id })
  await Factory.model('App/Models/Meetup').create()
  await Factory.model('App/Models/Scheduling').create({
    user_id: 1,
    meetup_id: 1,
  })

  const response = await client
    .post('/scheduling')
    .loginVia(user[1], 'jwt')
    .send({ meetup_id: 2 })
    .end()

  response.assertStatus(400)
  response.assertJSON({
    error:
      'Usuário não pode se cadastrar em dois eventos diferentes no mesmo horário',
  })
})

test('should list meetup that user is scheduled', async ({ client }) => {
  const date = addDays(new Date(), 5)
  const user = await Factory.model('App/Models/User').createMany(2)
  await Factory.model('App/Models/Meetup').create({
    date: format(date, 'yyyy-MM-dd HH:mm:ss'),
    user_id: user[1].id,
  })
  await Factory.model('App/Models/Scheduling').create()

  const response = await client
    .get('/scheduling')
    .loginVia(user[0], 'jwt')
    .end()

  response.assertStatus(200)
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
