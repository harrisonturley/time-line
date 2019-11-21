const notificationServiceMock = jest.genMockFromModule(
    "../notificationService");
  
  function getRestaurantsByKeywordAndCoordinates(key, coord) {
    return new Promise(function(success, nosuccess){
      if(key.includes("Tim")){
          success({});
      }
      nosuccess({});
   });
  }

  function checkToSendPusNotification(body, id) {
    return new Promise(function(success, nosuccess){
      if(id.includes("Tim")){
          success({});
      }
      nosuccess({});
   });
  }

  notificationServiceMock.getRestaurantsByKeywordAndCoordinates = getRestaurantsByKeywordAndCoordinates;
  notificationServiceMock.checkToSendPusNotification = checkToSendPusNotification;
  
  module.exports = notificationServiceMock;
