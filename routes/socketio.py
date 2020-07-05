from application import app, session, socketio, emit, send, join_room

@socketio.on('join room')
def on_join():
    room = session['room']
    join_room(room)
    print('room: ', room)
    emit('joined', {}, room=room)