import sys
import populartimes

#you can access arg1 using sys.argv[1], arg2 using sys.argv[2]
print("in python script")

#comment this line in when testing api
#id = sys.argv[1]


dataToSendBack = populartimes.get_id("api key", id)

print("the id is + ", id)
sys.stdout.flush()