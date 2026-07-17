from neo4j import GraphDatabase
from app.core.config import settings

class Neo4jConnection:
    def __init__(self):
        self.driver = None

    def connect(self):
        try:
            self.driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            self.driver.verify_connectivity()
            print("Successfully connected to Neo4j database.")
        except Exception as e:
            print(f"Failed to connect to Neo4j: {e}")

    def close(self):
        if self.driver:
            self.driver.close()
            print("Neo4j connection closed.")

    def get_session(self):
        if not self.driver:
            raise Exception("Driver not initialized!")
        return self.driver.session()

# Global database instance
db = Neo4jConnection()

# Dependency for FastAPI endpoints
def get_db_session():
    session = db.get_session()
    try:
        yield session
    finally:
        session.close()