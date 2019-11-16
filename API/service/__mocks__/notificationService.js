const notificationServiceMock = jest.genMockFromModule(
    "../notificationService");
  
  function getRestaurantsByKeywordAndCoordinates(key, coord) {
    return new Promise(function(success, nosuccess){
      if(key.includes("Tim")){
          //return what test wants
          success({});
      }
      nosuccess({});
   });
  }

  notificationServiceMock.getRestaurantsByKeywordAndCoordinates = getRestaurantsByKeywordAndCoordinates;
  
  module.exports = notificationServiceMock;
