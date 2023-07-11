from flask import Flask

from client_api.type_definitions import blueprint as type_definitions


app = Flask(__name__)
app.register_blueprint(blueprint=type_definitions)
