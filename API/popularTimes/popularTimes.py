import sys
import populartimes

api = sys.argv[1]
id = sys.argv[2]

#problem with yelp id vs google id
#get back specific day and time
dataToSendBack = populartimes.get_id(api, id)

print(dataToSendBack["populartimes"])

sys.stdout.flush()