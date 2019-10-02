'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/session', 'SessionController.store').validator('Session/Store')
Route.post('/users', 'UserController.store').validator('User/Store')
Route.put('/users', 'UserController.update')
  .validator('User/Update')
  .middleware(['auth'])

Route.post('/files', 'FileController.store').middleware(['auth'])
Route.put('/files/:id', 'FileController.update').middleware(['auth'])

Route.post('/meetup', 'MeetupController.store')
  .validator('Meetup/Store')
  .middleware(['auth'])

Route.put('/meetup/:id', 'MeetupController.update')
  .validator('Meetup/Update')
  .middleware(['auth'])

Route.delete('/meetup/:id', 'MeetupController.destroy').middleware(['auth'])

Route.get('/meetup/:userId', 'MeetupController.show').middleware(['auth'])
