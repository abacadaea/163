#!/usr/bin/python

from flask import Flask, make_response, render_template
import os.path, sys
app = Flask(__name__)

app = Flask(__name__, static_folder='static', static_url_path='')
app.debug = True
app.secret_key = '@#0-fgljrl230i-0diflkjdflsdf'

@app.route('/')
def index():
    return render_template("index.html")

if (app.debug):
    from werkzeug.debug import DebuggedApplication
    app.wsgi_app = DebuggedApplication( app.wsgi_app, True )

if __name__ == '__main__':
    app.run()
