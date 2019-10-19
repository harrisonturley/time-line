const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//async -> had it as async in the docs?
function verifyId(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // need CLIENT_ID 
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  
  //ok now what do i do.... now that i have userid
  //check if the user is already in our user db
  //if so, establish authenticated session ??
  // if not then what?

  return userid;
}

// is this right or do i need to put something else in here
//verifyId().catch(console.error);


module.exports = {verifyId};