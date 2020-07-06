from . import User

class Users():
    def __init__(self):
        self.users = []
        
    def usersNumber(self):
        return len(self.users)

    def addUser(self, username, room):
        added = False
        foundUser = self.__searchUser(username, room)
        if username and room and not foundUser:
            createdUser = User(username, room)
            self.users.append(createdUser)
            added = True
        return added

    def __searchUser(self, username, room):
        foundUser = None
        i = 0

        while i < len(self.users) and not foundUser:
            currentUser = self.users[i]
            if currentUser.getUsername() == username and currentUser.getRoom() == room:
                foundUser = currentUser
        return foundUser