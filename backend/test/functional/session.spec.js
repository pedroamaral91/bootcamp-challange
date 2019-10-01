'use strict'

const { test, trait } = use('Test/Suite')('Session')
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('Test/ApiClient')

test('should generate a token with id user in payload', async ({ client }) => {
  const { email } = await Factory.model('App/Models/User').create()
  const response = await client
    .post('/session')
    .send({
      email,
      password: 'secret',
    })
    .end()
  response.assertStatus(200)
  response.assertJSON({
    token: response.body.token,
  })
})

test('should fail if user not exists', async ({ client }) => {
  const response = await client
    .post('/session')
    .send({ email: 'notfound@gmail.com', password: '12345' })
    .end()

  response.assertStatus(404)
  response.assertJSON({
    error: 'Usuário não encontrado',
  })
})

test('should fail in form validation', async ({ client }) => {
  const response = await client
    .post('/session')
    .send({ email: 'invalidemail', password: '1234' })
    .end()
  response.assertStatus(422)
  response.assertJSON({
    error: 'Dados inconsistentes',
  })
})
