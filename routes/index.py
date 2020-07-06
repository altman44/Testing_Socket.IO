from application import app, render_template, session, request, redirect

@app.route('/')
def index():
    print(session)
    if not session['username']:
        return render_template('login.html')
    return redirect(request.url)

@app.route('/login', methods=['GET', 'POST'])
def login():
    username = request.form.get('username')
    if username:
        session['username'] = username
        return render_template('select.html')
    return render_template('login.html', message='You must enter your username', type='danger')    


@app.route('/select/<room>')
def posts(room):
    print("ROOM: ", room)
    session['room'] = room
    return render_template('drawing.html', room=room)
