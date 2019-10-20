const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// still need to test in conjunction with the front end.
// async -> had it as async in the docs?
function verifyId(token) {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // need CLIENT_ID 
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  // currently just return id to check if they exist.
  return userid;
}

//verifyId().catch(console.error);

module.exports = {verifyId};