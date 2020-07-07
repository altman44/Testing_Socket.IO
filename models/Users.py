from models.User import User

class Users():
    def __init__(self):
        self.__users = []
        
    def usersNumber(self):
        return len(self.__users)

    def getUsernamesByRoom(self, room):
        usernames = []
        for user in self.__users:
            if user.getRoom() == room:
                print("username: ", user.getUsername())
                usernames.append(user.getUsername())
        return usernames

    def addUser(self, username, room):
        added = False
        print('adding: ', username, room)
        if username != '' and int(room) > 0:
            print('usuario y room')
            foundUser = self.searchUser(username, room)
            print(foundUser)
            if not foundUser:
                createdUser = User(username, room)
                print('added: ', createdUser.getUsername())
                self.__users.append(createdUser)
                added = True
        return added

    def searchUser(self, username, room):
        foundUser = None
        i = 0
        while i < len(self.__users) and not foundUser:
            currentUser = self.__users[i]
            if currentUser.getUsername() == username and currentUser.getRoom() == room:
                foundUser = currentUser
            i += 1
        return foundUser