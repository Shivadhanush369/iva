const Agenda = require('agenda');
const axios = require('axios');
const scheduledcall = require('./scheduledcall');
const oneweek = require('./models/oneweek');
const mongoConnectionString = 'mongodb://127.0.0.1/agenda1';
const agenda = new Agenda({ db: { address: mongoConnectionString } });
const connectDB = require('./db/db');

agenda.define('fetch data', { priority: 'high', concurrency: 5 }, async (job, done) => {
  try {
    await connectDB();
    const oneweeks = await oneweek.find();
    const urls = oneweeks.map(obj => ({ url: obj.scope, cvssScore: obj.cvssScore ,username:obj.username}));  
    scheduledcall.weekOne(urls);
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
  await agenda.every('0 0 * * 0', 'fetch data'); // Schedule job to run every week
  await agenda.now('fetch data'); // Run job immediately for testing
})();

console.log('Scheduler initialized');
