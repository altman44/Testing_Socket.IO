# openssl rand -base64 32 # To generate 50 character random string

from flask import Flask, session, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit, send, join_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'INqu/uNR6rH9rYGeb6fg0sRRtqv5xjmAorKMG6a1vJA='
socketio = SocketIO(app)

from models.Users import Users

users = Users()

# Routes
@app.before_request
def before_request():
    if 'username' not in session:
        session['username'] = None
    if 'room' not in session:
        session['room'] = 0

import routes.index
import routes.socketio

if __name__ == '__main__':
    socketio.run(app)