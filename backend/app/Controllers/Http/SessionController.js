'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

class SessionController {
  async store({ request, response, auth }) {
    try {
      const { email, password } = request.all()
      const user = await User.findByOrFail('email', email)
      const { token } = await auth.attempt(email, password, {
        id: user.id,
        email: user.email,
      })
      return { token }
    } catch (er) {
      if (er.name === 'ModelNotFoundException') {
        return response.status(404).send({ error: 'Usuário não encontrado' })
      }
      return response
        .status(400)
        .send({ error: 'Não foi possível concluir operação' })
    }
  }
}

module.exports = SessionController
