import sys
import populartimes

api = sys.argv[1]
id = sys.argv[2]
day = sys.argv[3]
hour = sys.argv[4]

#problem with yelp id vs google id
#get back specific day and time
dataToSendBack = populartimes.get_id(api, id)

#first number corresponds to day of week monday: 0 sunday: 6
#second number is the hour 0 to 23
print(dataToSendBack["populartimes"][int(day)]["data"][int(hour)])

sys.stdout.flush()