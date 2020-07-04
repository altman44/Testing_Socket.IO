from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
# app.config['SECRET_KEY'] 
socketio = SocketIO(app)

import routes.index