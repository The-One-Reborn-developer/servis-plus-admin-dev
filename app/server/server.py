import os

from flask import Flask

from dotenv import (
    load_dotenv,
    find_dotenv
)

from app.server.admin import admin_blueprint
from app.server.tables import tables_blueprint


load_dotenv(find_dotenv())
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(PROJECT_ROOT)
TEMPLATES_DIR = f"{BASE_DIR}/web/templates"
STATIC_DIR = f"{BASE_DIR}/web/static"

app = Flask(
    __name__,
    template_folder=TEMPLATES_DIR,
    static_folder=STATIC_DIR
)
app.secret_key = os.getenv('SECRET_KEY')
app.register_blueprint(admin_blueprint)
app.register_blueprint(tables_blueprint, url_prefix='/dashboard')


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('assets/favicon.ico')


if __name__ == '__main__':
    app.run(debug=True)
