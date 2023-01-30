const cron = require('node-cron')
const { deactivateFreeTrial } = require('./jobs')
const Time = require('./time')

const runCron = () => {
  cron.schedule(Time.MIDNIGHT, () => {
    deactivateFreeTrial()
  })
}
module.exports = runCron
