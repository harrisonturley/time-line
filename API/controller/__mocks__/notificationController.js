const notificationMock= jest.genMockFromModule(
  "../notificationController");

function send(message) {
  
  return new Promise(function(success, nosuccess){

    if(message.notification.body.includes("Tim")){
        nosuccess("error sending message");
    }
    else {success("sent message");}
 });

}

notificationMock.admin.messaging().send = send;

module.exports = notificationMock;