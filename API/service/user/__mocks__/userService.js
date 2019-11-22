const userServiceMock = jest.genMockFromModule(
    "../userService");
  
  function getUserByEmail(id) {
    return new Promise(function(success, nosuccess){
      if(id.includes("hello")){
          success({name: "victoria", balance: 1});
      }
      if(id.includes("hello1")){
        success({name: "victoria", balance: 1});
      }
      nosuccess({});
   });
  }

  function deleteUser(id) {
    return new Promise(function(success, nosuccess){
  
        if(id.includes("err")){
           nosuccess({});
        }
        success({});
     });
  }

  function addUser(body) {
    
    return new Promise(function(success, nosuccess){
  
        if(body.name.includes("vic")){
            success({name: "vic", balance: 0});
        }
        nosuccess({statusCode: 422});
   });
  }

  function updateUser(id, body) {
    
    return new Promise(function(success, nosuccess){
        if(id.includes("hello1")){
            success({name: "victoria", balance: 1});
        }
        nosuccess({});
     });
  }

  userServiceMock.getUserByEmail = getUserByEmail;
  userServiceMock.addUser = addUser;
  userServiceMock.updateUser = updateUser;
  userServiceMock.deleteUser = deleteUser;
  
  module.exports = userServiceMock;
