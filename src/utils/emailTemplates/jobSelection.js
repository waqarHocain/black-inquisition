function jobSelection(company, job) {
  return `
    <h1>Black Inquisition</h1>
    <br />
    <p>Hello, today is a lucky day. 
    You've been selected on <a href="https://blackinquisition.net">BlackInquisition</a> site by ${company.name} for the job you applied.</p>
    <h3>Company details:</h3>
    <dl>
      <dt>Company Name:</dt>
      <dd>${company.name}</dd>
      <dt>Company Email:</dt>
      <dd>${company.email}</dd>
      <dt>Company Phone:</dt>
      <dd>${company.phone}</dd>
    </dl>
    
    <br />
    
    <h3>Job details:</h3>
    <dl>
      <dt>Title:</dt>
      <dd>${job.title}</dd>
      <dt>Location:</dt>
      <dd>${job.location}</dd>
      <dt>Type:</dt>
      <dd>${job.type}</dd>
      <dt>Workplace:</dt>
      <dd>${job.workplace}</dd>
    </dl>

    <br />
    <p>To view complete info about this job, please <a href="https://blackinquisition.net/jobs/${job.id}">click here</a></p>

    <br />
    <p><a href="https://blackinquisition.net/">https://blackinquisition.net/</a></p>
  `;
}

module.exports = { jobSelection };
