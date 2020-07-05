from application import app, render_template, session

@app.route('/')
def index():
    session['room'] = 0
    return render_template('main.html')

@app.route('/posts/<room>')
def posts(room):
    print("ROOM: ", room)
    session['room'] = room
    return render_template('posts.html', room=room)
