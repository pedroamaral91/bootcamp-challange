'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')
const { test, trait } = use('Test/Suite')('User')
trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

test('should register a user', async ({ client }) => {
  const response = await client
    .post('/users')
    .send({
      username: 'Teste',
      email: 'test@gmail.com',
      password: '123456',
      password_confirmation: '123456',
    })
    .end()
  response.assertStatus(201)
  response.assertJSON({
    message: 'Usuário criado com sucesso',
  })
})

test('should fail if email already exists', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const response = await client
    .post('/users')
    .send({
      username: 'Teste',
      email: user.email,
      password: '12345',
      password_confirm: '12345',
    })
    .end()
  response.assertStatus(422)
  response.assertJSON({
    error: 'Email já cadastrado',
  })
})

test('it should update user', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .put('/users')
    .loginVia(user, 'jwt')
    .send({
      password: 'new_password',
      password_confirmation: 'new_password',
    })
    .end()
  response.assertStatus(204)

  await user.reload()

  assert.isTrue(await Hash.verify('new_password', user.password))
})
