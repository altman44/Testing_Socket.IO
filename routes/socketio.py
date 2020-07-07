from application import app, session, socketio, emit, join_room, users

@socketio.on('join room')
def on_join():
    username = session['username']
    room = session['room']
    print(username, room)
    if room:
        data = {}
        join_room(room)
        data['newUser'] = username
        added = users.addUser(username, room)
        print("added: ", added)
        data['usernames'] = users.getUsernamesByRoom(room)
        emit('joined', data, room=room)

@socketio.on('draw')
def draw(data):
    room = session['room']
    emit('show draw', data, room=room)

@socketio.on('erase drawing')
def eraseDrawing():
    room = session['room']
    print('a')
    emit('show erasing', room=room)
