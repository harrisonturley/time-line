import sys
import populartimes

api = sys.argv[1]
id = sys.argv[2]

#comment this line in when testing api
#id = sys.argv[1]
#pass in api key too

#dataToSendBack = populartimes.get_id("api key", id)
#dataToSendBack = populartimes.get_id("AIzaSyBzoCSZ-1jPGa2hG8VD5CK2xqMKGiTGFFs", "FX7Dw41atuJ4oeTK6WtDUQ")#id)
dataToSendBack = populartimes.get_id(api, id)

print(dataToSendBack)

sys.stdout.flush()