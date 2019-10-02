'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Meetup = use('App/Models/Meetup')
/**
 * Resourceful controller for interacting with schedulings
 */
class SchedulingController {
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
  async store({ request, response, auth }) {
    try {
      const user = await auth.getUser()
      const { meetup_id } = request.all()

      const meetup = await Meetup.findOrFail(meetup_id)
      if (meetup.user_id === user.id) {
        throw new Error(
          'Não é possível o organizador se inscrever no próprio evento.'
        )
      }
      await meetup
        .scheduling()
        .create({ meetup_id: meetup.id, user_id: user.id })
      return response
        .status(201)
        .send({ message: 'Inscrição realizada com sucesso!' })
    } catch (err) {
      return response.status(400).send({ error: err.message })
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = SchedulingController
