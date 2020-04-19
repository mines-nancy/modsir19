import os
basedir = os.path.abspath(os.path.dirname(__file__))
from dotenv import load_dotenv
load_dotenv(verbose=True)

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed'
    PG_COVID_USER = os.environ['PG_COVID_USER']
    PG_COVID_PASSWORD = os.environ['PG_COVID_PASSWORD']
    PG_COVID_HOST = os.environ['PG_COVID_HOST']
    PG_COVID_PORT = os.environ['PG_COVID_PORT']
    PG_COVID_DB_NAME = os.environ['PG_COVID_DB_NAME']
    SQLALCHEMY_DATABASE_URI = "postgresql://%s:%s@%s:%s/%s" % (
        PG_COVID_USER,
        PG_COVID_PASSWORD,
        PG_COVID_HOST,
        PG_COVID_PORT,
        PG_COVID_DB_NAME
    )




class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True