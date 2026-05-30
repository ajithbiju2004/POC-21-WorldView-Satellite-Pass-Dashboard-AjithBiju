from sqlalchemy import create_engine

DATABASE_URL = "sqlite:///satellites.db"

engine = create_engine(DATABASE_URL)