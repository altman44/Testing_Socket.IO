from application import app, socketio, render_template

@app.route('/')
def index():
    return render_template('main.html')

@app.route('/posts')
def posts():
    return render_template('posts.html')
