from fastapi import FastAPI
import psycopg2
import psycopg2
from dotenv import load_dotenv
import os
from pydantic import BaseModel

# load .env
load_dotenv()
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
# Connect to the database
conn= psycopg2.connect(f"user={USER} password={PASSWORD} host={HOST} port={PORT} dbname={DBNAME}")
cursor = conn.cursor()

app = FastAPI()
 
@app.get("/")
def root():
	return {"Hello" : "World"}
 
class Item(BaseModel):
    sql: str

@app.post("/select_send")
def SELECT_Send(item : Item) -> bool:
    try:
        #cursor.execute("SELECT NOW();")
        cursor.execute(item.sql)
        results = cursor.fetchall()
        if results:
            print(results)
            return True
        else:
            conn.rollback() # roll back the changes since this is not a valid command
            return False
    except:
        conn.rollback() # roll back the changes since this is not a valid command
        return False     
    
@app.post("/update_send")
def UPDATE_Send(item : Item) -> bool:
    try:
        print(item)
        # sending a SQL that corresponds to SELECT
        cursor.execute(item.sql)
        return True
    except:
        conn.rollback() # roll back the changes since this is not a valid command
        return False     
    
@app.post("/delete_send")
def DELTE_SEND(item : Item) -> bool:
    try:
        print(item)
        # sending a SQL that corresponds to SELECT
        cursor.execute(item.sql)
        return True
    except:
        conn.rollback() # roll back the changes since this is not a valid command
        return False     


@app.post("/commit")
def COMMIT(item : Item):
    conn.commit()