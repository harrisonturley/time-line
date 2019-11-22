const lineupMock = jest.genMockFromModule(
    "../lineup");
  
//if return nosucess, automatically causes test to fail
  function findOne(body) {
    return new Promise(function(success, nosuccess){
      if(body.id.includes("test id")){
          success({lineupTime: 5});
      }
      success("error");
   });
  }

  function find(body) {
    return new Promise(function(success, nosuccess){
      if(body.id.$in.includes("test id")){
          success({lineupTime: 5});
      }
      success([]);
   });
  }

  function create(body){
    return new Promise(function(success, nosuccess){
  
        if(body.data === "non existent"){
            success({statusCode: 422});
        }
        success({lineupTime: 0});
     });
  }

  //work in conjuction w notif service mock
  function findOneAndUpdate(id, body, cond) {
    
    return new Promise(function(success, nosuccess){
  
        if(body.data === "non existent"){
            success({statusCode: 422});
        }
        success({lineupTime: 7});
   });
  }
  
  function findOneAndDelete(body) {
    
    return new Promise(function(success, nosuccess){
  
      if(body.id.includes("non existent")){
         success();
      }
      success({});
   });
  }
  
  lineupMock.findOne = findOne;
  lineupMock.find = find;
  lineupMock.create = create;
  lineupMock.findOneAndUpdate = findOneAndUpdate;
  lineupMock.findOneAndDelete = findOneAndDelete;
  
  module.exports = lineupMock;
