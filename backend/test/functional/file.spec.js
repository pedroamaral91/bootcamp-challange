'use strict'
/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Helpers = use('Helpers')
const { test, trait } = use('Test/Suite')('File')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const File = use('App/Models/File')

trait('Test/ApiClient')
trait('DatabaseTransactions')
trait('Auth/Client')

test('user should be save a file', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post('/files')
    .loginVia(user, 'jwt')
    .attach('image', Helpers.tmpPath('test.jpeg'))
    .end()

  const file = await File.find(1)
  response.assertStatus(200)
  response.assertJSONSubset({
    name: file.name,
  })
})

test('should be update a file', async ({ client, assert }) => {
  const file = await Factory.model('App/Models/File').create()
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .put('/files/1')
    .loginVia(user, 'jwt')
    .attach('image', Helpers.tmpPath('test.jpeg'))
    .end()
  response.assertStatus(204)
  const oldFile = file.file
  await file.reload()
  assert.notEqual(oldFile, file.file)
})
