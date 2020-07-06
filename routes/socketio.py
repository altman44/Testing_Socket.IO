from application import app, session, socketio, emit, send, join_room, users
from flask import request
@socketio.on('join room')
def on_join():
    #print("request.sid", request.sid)
    room = session['room']
    join_room(room)
    print('room: ', room)
    username = session['username']
    users.addUser(username, room)
    emit('joined', {}, room=room)

