from ariadne import QueryType, ObjectType, ScalarType, make_executable_schema
from ariadne.asgi import GraphQL
from starlette.applications import Starlette
import uvicorn
import databases
import sqlalchemy
import os

################################################################################
# SQLAlchemy example, from Starlette docs
# See https://www.starlette.io/database/

# Configuration from environment variables
DATABASE_URL = f"postgresql://{os.environ.get('POSTGRES_USER')}:{os.environ.get('POSTGRES_PASSWORD')}@{os.environ.get('POSTGRES_HOST')}:{os.environ.get('POSTGRES_PORT')}/{os.environ.get('POSTGRES_DB')}"

# Database table definitions.
metadata = sqlalchemy.MetaData()

projects = sqlalchemy.Table(
    "Project",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("createdAt", sqlalchemy.DateTime),
    sqlalchemy.Column("updatedAt", sqlalchemy.DateTime),
    sqlalchemy.Column("name", sqlalchemy.String),
)

database = databases.Database(DATABASE_URL)

print(f"Connecting to {DATABASE_URL}")

################################################################################
# GraphQL section, from the Ariadne docs
# See https://ariadnegraphql.org/docs/starlette-integration

type_defs = """
    scalar DateTime
    scalar Json

    type Query {
        hello: String!
        projects(first: Int): [Project!]!
    }

    type Project {
        id:        Int
        createdAt: DateTime
        updatedAt: DateTime
        name:      String
    }
"""


datetime_scalar = ScalarType("DateTime")


@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


query = QueryType()


@query.field("hello")
def resolve_hello(*_):
    return "Hello world!"


@query.field("projects")
async def resolve_projects(_, info, first=10):
    query = projects.select().limit(first)
    results = await database.fetch_all(query)
    return results


# project = ObjectType("Project")


# Create executable schema instance
schema = make_executable_schema(type_defs, query, datetime_scalar)

app = Starlette(
    debug=True, on_startup=[database.connect], on_shutdown=[database.disconnect]
)

app.mount("/graphql", GraphQL(schema, debug=True))

################################################################################
# Launch uvicorn programmatically, from the uvicorn docs
# http://www.uvicorn.org/#running-programmatically

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")
