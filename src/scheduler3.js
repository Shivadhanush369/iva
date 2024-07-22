const Agenda = require('agenda');
const axios = require('axios');
const scheduledcall = require('./scheduledcall');
const oneday = require('./models/oneday');
const mongoConnectionString = 'mongodb://127.0.0.1/agenda1';
const agenda = new Agenda({ db: { address: mongoConnectionString } });
const connectDB = require('./db/db');

agenda.define('fetch data', { priority: 'high', concurrency: 5 }, async (job, done) => {
  try {
    await connectDB();
    const oneDay = await oneday.find();
    const urls = oneDay.map(obj => ({ url: obj.scope, phonenumber: obj.cvssScore,username:obj.username }));      console.log(urls);
    console.log(urls);
    scheduledcall.dayOne(urls);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Throw error to trigger retry
  }
  done();
});

agenda.on('fail:fetch data', (err, job) => {
  console.error(`Job failed with error: ${err.message}`);
});

(async function() {
  await agenda.start();
  await agenda.every('0 0 * * *', 'fetch data'); // Schedule job to run every day
  await agenda.now('fetch data'); // Run job immediately for testing
})();

console.log('Scheduler initialized');
