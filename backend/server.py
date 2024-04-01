from client_api.type_definitions import blueprint as type_definitions
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.register_blueprint(blueprint=type_definitions)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)

if __name__ == "__main__":
    socketio.run(app)
