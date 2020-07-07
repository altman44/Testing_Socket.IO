class User():
    def __init__(self, username, room):
        self.__username = username
        self.__room = room
        self.__score = 0
    
    def getUsername(self):
        return self.__username

    def getRoom(self):
        return self.__room
    
    def getScore(self):
        return self.__score