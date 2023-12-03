const Queue = require("bull");
const { REDIS_URL } = require("../config");
const { transporter } = require("./mail");

const mailQueue = new Queue("mail", REDIS_URL);

mailQueue.process(async (job, done) => {
  try {
    await transporter.sendMail(job.data);
    console.log("Sent mail to: ", job.data.to);
    done(null);
  } catch (e) {
    console.log(e);
    done(e);
  }
});

module.exports = mailQueue;
