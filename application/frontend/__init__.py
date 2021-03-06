# coding=UTF-8
"""
    application.frontend.__init__
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    by dorajistyle

    __init__ frontend module

"""
from functools import wraps

from flask import render_template
from werkzeug.exceptions import InternalServerError, NotFound
from application.core import babel
from application import factory
from application.helpers import JSONEncoder
from application.frontend import assets
from application.properties import STATIC_FOLDER, STATIC_FOLDER_DEBUG, STATIC_GUID, STATIC_FOLDER_PATH
from datetime import datetime

def create_app(settings_override=None):
    """Returns the main application instance"""
    app = factory.create_app(__name__, __path__, settings_override)



    # Set static folder
    app.static_folder = STATIC_FOLDER
    if app.debug:
        app.static_folder = STATIC_FOLDER_DEBUG
        # Init assets
        assets.init_app(app)

    app.jinja_env.add_extension('pyjade.ext.jinja.PyJadeExtension')
    app.json_encoder = JSONEncoder

    for e in [500, 404]:
        try:
            app.errorhandler(e)(handle_error)
        except:
            pass

    if not app.debug:
        for e in [500, 404]:
            app.errorhandler(e)(handle_error)

    @app.context_processor
    def inject_default():
        lang = babel.app.config['BABEL_DEFAULT_LOCALE']
        this_year = datetime.now().year
        return dict(lang=lang, this_year=this_year, static_path=STATIC_FOLDER_PATH, static_guid=STATIC_GUID)

    return app


def handle_error(e):
    """
    A Error handler
    :param e:
    :return:
    """

    if isinstance(e, InternalServerError) or isinstance(e, NotFound):
        return render_template('%s.jade' % e.code, error=e), e.code
    return render_template('500.jade'), 500


def route(bp, *args, **kwargs):
    """
    A decorator.
    :param bp: Blueprint
    :param args:
    :param kwargs:
    :return:
    """

    def decorator(f):
        @bp.route(*args, **kwargs)
        @wraps(f)
        def wrapper(*args, **kwargs):
            return f(*args, **kwargs)

        return f

    return decorator

