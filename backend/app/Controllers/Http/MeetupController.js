'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Meetup = use('App/Models/Meetup')

/**
 * Resourceful controller for interacting with meetups
 */
class MeetupController {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.all()

    await Meetup.create(data)

    return response
      .status(201)
      .send({ message: 'Dados cadastrados com sucesso!' })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response }) {
    const data = await Meetup.query()
      .where('user_id', params.userId)
      .fetch()
    return response.status(200).send({ meetup: data.toJSON() })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ auth, params, request, response }) {
    try {
      const user = await auth.getUser()
      const meetup = await Meetup.findOrFail(params.id)
      if (user.id !== meetup.user_id) {
        throw Error()
      }
      const data = request.only([
        'title',
        'description',
        'localization',
        'date',
      ])

      meetup.merge(data)
      await meetup.save()
      return response
        .status(204)
        .send({ message: 'Dados atualizados com sucesso!' })
    } catch (err) {
      if (err.name === 'ModelNotFoundException') {
        return response.status(404).send({ error: 'Meetup não encontrada' })
      }
      return response
        .status(400)
        .send({ error: 'Não foi possível concluir operação' })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, auth }) {
    try {
      const user = await auth.getUser()
      const meetup = await Meetup.findOrFail(params.id)
      if (meetup.user_id !== user.id) {
        throw new Error('Usuário não é organizador desta meetup')
      }
      if (meetup.date < new Date()) {
        throw new Error('Meetup já ocorreu')
      }
      await meetup.delete()
      return response
        .status(200)
        .send({ message: 'Operação concluída com sucesso' })
    } catch (err) {
      return response.status(400).send({ error: err.message })
    }
  }
}

module.exports = MeetupController
