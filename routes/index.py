from application import app, render_template, session, request, redirect, url_for

@app.route('/')
def index():
    print(session)
    if not session['username']:
        return render_template('login.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if session['username']:
            currentRoom = session['room']
            if currentRoom:
                return redirect(f'/select/{currentRoom}')
            else:
                return render_template('select.html')

    if request.method == 'POST':
        username = request.form.get('username')
        if username:
            session['username'] = username
            return render_template('select.html')

    return render_template('login.html', message='You must enter your username', type='danger')    


@app.route('/select/<room>')
def selectRoom(room):
    if session['username']:
        if session['room']:
            if session['room'] == room:
                return render_template('drawing.html', roomNumber=room)
            else:
                return redirect(f'/select/{session["room"]}')
        else:
            print("ROOM: ", room)
            session['room'] = room
            return render_template('drawing.html', roomNumber=room)
    
    return render_template(url_for('login'))
