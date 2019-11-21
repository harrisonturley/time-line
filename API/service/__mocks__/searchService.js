const searchServiceMock = jest.genMockFromModule(
    "../searchService");
  
  function getRestaurantsByKeywordAndCoordinates(key, coord) {
    return new Promise(function(success, nosuccess){
      if(key && key.includes("Tim")){
          success({});
      }
      nosuccess({});
   });
  }

  searchServiceMock.getRestaurantsByKeywordAndCoordinates = getRestaurantsByKeywordAndCoordinates;
  
  module.exports = searchServiceMock;
