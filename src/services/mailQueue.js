const Queue = require("bull");
const { REDIS_URL } = require("../config");

const mailQueue = new Queue("mail", REDIS_URL);

mailQueue.process(async (job, done) => {
  console.log("sending email...");
  console.log(job.data);
  done(null);
});

module.exports = mailQueue;
