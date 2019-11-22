import sys
import datetime
import populartimes

api = sys.argv[1]
restaurantid = sys.argv[2]

day = datetime.datetime.today().weekday()
hour = datetime.datetime.today().hour

dataToSendBack = populartimes.get_id(api, restaurantid)

#first number corresponds to day of week monday: 0 sunday: 6
#second number is the hour 0 to 23
print(dataToSendBack["populartimes"][int(day)]["data"][int(hour)])

sys.stdout.flush()