'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class UserController {
  async store({ request, response }) {
    const { username, email, password } = request.all()
    await User.create({ username, email, password })
    return response.status(201).send({ message: 'Usuário criado com sucesso' })
  }

  async update({ request, response, auth }) {
    const { password } = request.all()
    const user = await auth.getUser()
    user.password = password
    await user.save()

    return response
      .status(204)
      .send({ message: 'Senha atualizada com sucesso!' })
  }
}

module.exports = UserController
