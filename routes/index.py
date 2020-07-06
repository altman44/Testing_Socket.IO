from application import app, render_template, session, request

@app.route('/')
def index():
    session['room'] = 0
    return render_template('login.html')

@app.route('/select')
def selectRoom():
    room = request.form.get('room')
    print(room)
    return render_template('select.html')

@app.route('/drawing/<room>')
def posts(room):
    print("ROOM: ", room)
    session['room'] = room
    return render_template('drawing.html', room=room)
