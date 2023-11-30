function newCandidate(user) {
  return `
    <h1>Black Inquisition</h1>
    <br />
    <p>Hi, you've a new application for your job. Here's the user detail:</p>
    <br />
    <dl>
      <dt>Name:</dt>
      <dd>${user.name}</dd>
      <br/>
      <dt>Email:</dt>
      <dd>${user.email}</dd>
    </dl>
    <br />
    <br />
    <p>To view complete info or to select a candidate, please <a href="https://blackinquisition.net/company/profile">click here</a></p>
  `;
}

module.exports = { newCandidate };
