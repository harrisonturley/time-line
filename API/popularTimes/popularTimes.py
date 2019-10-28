import sys
import populartimes

#you can access arg1 using sys.argv[1], arg2 using sys.argv[2]
print("in python script")

#comment this line in when testing api
#id = sys.argv[1]

#unhardcode id
dataToSendBack = populartimes.get_id("AIzaSyBzoCSZ-1jPGa2hG8VD5CK2xqMKGiTGFFs", "FX7Dw41atuJ4oeTK6WtDUQ")#id)

print("the id is + ", id)
sys.stdout.flush()