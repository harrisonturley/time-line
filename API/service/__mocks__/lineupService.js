const lineupServiceMock = jest.genMockFromModule(
    "../lineupService");
  
  /*mockNotificationController.admin.messaging().send = jest.fn(
    message => if(message.notification.body == "")
  )
  
  const mock = jest.fn().mockImplementation(() => {
    return {playSoundFile: mockPlaySoundFile};
  });*/
  
  function getLineupById(id) {
    return new Promise(function(success, nosuccess){
      if(id.includes("FX7Dw41atuJ4oeTK6WtDUQ")){
          //return what test wants
          success({lineupTime: 8});
      }
      nosuccess({});
   });
  }

  function getLineupByIds(id) {
    
    return new Promise(function(success, nosuccess){
  
      if(id.includes("FX7Dw41atuJ4oeTK6WtDUQ")){
          //return what test wants
          success({lineupTime: 8});
      }
      nosuccess({});
   });
  
  }

  function addLineup(body) {
    
    return new Promise(function(success, nosuccess){
  
      if(body.bad_id == "bad id"){
          nosuccess({statusCode: 422});
      }
      success();
   });
  }

  function updateLineup(id) {
    
    return new Promise(function(success, nosuccess){
  
      if(id.includes("FX7Dw41atuJ4oeTK6WtDUQ")){
          success({lineupTime: 8});
      }
      nosuccess({});
   });
  }
  
  function deleteLineup(id) {
    
    return new Promise(function(success, nosuccess){
  
      if(id.includes("err")){
         nosuccess({});
      }
      success({});
   });
  }
  
  lineupServiceMock.getLineupById = getLineupById;
  lineupServiceMock.getLineupByIds = getLineupByIds;
  lineupServiceMock.addLineup = addLineup;
  lineupServiceMock.updateLineup = updateLineup;
  lineupServiceMock.deleteLineup = deleteLineup;
  
  module.exports = lineupServiceMock;
