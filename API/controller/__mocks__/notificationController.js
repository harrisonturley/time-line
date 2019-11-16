// firebaseAdmin.admin.messaging().send(message)



const notificationMock= jest.genMockFromModule(
  "../notificationController");

/*mockNotificationController.admin.messaging().send = jest.fn(
  message => if(message.notification.body == "")
)

const mock = jest.fn().mockImplementation(() => {
  return {playSoundFile: mockPlaySoundFile};
});*/

function send(message) {
  
  return new Promise(function(success, nosuccess){

    if(message.notification.body.includes("Tim")){
        nosuccess("error sending message");
    }
    else success("sent message");
 });

}


notificationMock.admin.messaging().send = send;

module.exports = notificationMock;