'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Meetup = use('App/Models/Meetup')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Scheduling = use('App/Models/Scheduling')
const User = use('App/Models/User')

const Mail = use('Mail')

const { isAfter, parseISO, format, isEqual } = use('date-fns')

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
  async index({ request, response, auth }) {
    const user = await auth.getUser()
    const today = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    const schedulings = await Meetup.query()
      .where('date', '>', today)
      .with('scheduling', builder => builder.where('user_id', user.id))
      .orderBy('date', 'DESC')
      .first()

    return response.status(200).send({ data: schedulings })
  }

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

      const alreadyScheduled = await Scheduling.query()
        .where('user_id', user.id)
        .andWhere('meetup_id', meetup.id)
        .fetch()

      if (alreadyScheduled.rows.length > 0) {
        throw new Error('Usuário já cadastrado para esse evento')
      }

      const meetups = await Meetup.query()
        .where('user_id', user.id)
        .fetch()

      const dateNow = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      meetups.rows.map(meetup => {
        if (isEqual(parseISO(dateNow), parseISO(meetup.date))) {
          throw new Error(
            'Usuário não pode se cadastrar em dois eventos diferentes no mesmo horário'
          )
        }
      })

      if (isAfter(parseISO(dateNow), parseISO(meetup.date))) {
        throw new Error('Meetup já aconteceu')
      }

      await meetup.scheduling().attach(user.id)

      const dadosMeetup = meetup.toJSON()
      dadosMeetup.date = format(parseISO(meetup.date), 'dd/MM/yyyy HH:mm:ss')

      await Mail.send(
        'emails.schedule.meetupscheduling',
        dadosMeetup,
        message => {
          message
            .to(user.email)
            .from('pedro@gmail.com')
            .subject('Meetup agendado com sucesso!')
        }
      )

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
