const userMock = jest.genMockFromModule(
    "../user");
  
//if return nosucess, automatically causes test to fail
  function findOne(body) {
    return new Promise(function(success, nosuccess){
      if(body.email.includes("servicetest")){
          success({name: "jenny", balance: 0});
      }
      success();
   });
  }

  function create(body){
    return new Promise(function(success, nosuccess){
  
        if(body.name === "bob"){
            success({name: "bob", balance: 0});
        }
        nosuccess({message: "failed"});
     });
  }

  function findOneAndUpdate(email, body) {
    
    return new Promise(function(success, nosuccess){
  
        if(body.balance === 9){
            success({name: "bob", balance: 9});
        }
        nosuccess({message: "failed"});
   });
  }
  
  function findOneAndRemove(body) {
    
    return new Promise(function(success, nosuccess){
  
      if(body.email.includes("non existent")){
         success();
      }
      success({});
   });
  }
  
  userMock.findOne = findOne;
  userMock.create = create;
  userMock.findOneAndUpdate = findOneAndUpdate;
  userMock.findOneAndRemove = findOneAndRemove;
  
  module.exports = userMock;
