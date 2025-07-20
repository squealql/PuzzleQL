from fastapi import FastAPI
import psycopg2
from dotenv import load_dotenv
from pydantic import BaseModel
import google.generativeai as genai
import os
from fastapi.middleware.cors import CORSMiddleware
# load .env
load_dotenv()
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
GEMINIKEY = os.getenv("gemini_key")
# Connect to the database
conn= psycopg2.connect(f"user={USER} password={PASSWORD} host={HOST} port={PORT} dbname={DBNAME}")
cursor = conn.cursor()

genai.configure(api_key=GEMINIKEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = FastAPI()
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
	return {"Hello" : "World"}
 
class Item(BaseModel):
    sql: str

class Prompt(BaseModel):
    prompt: str

class CreateItem(BaseModel):
    sql: str
    userid: str

def getallfromtable(tablename : str):
    cursor.execute(f"SELECT * FROM {tablename}")
    vals = cursor.fetchall()
    return vals

def getcolumnsfromtable(tablename : str):
    cursor.execute("""
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns 
    WHERE table_name = %s AND table_schema = 'public'
    ORDER BY ordinal_position
""", (tablename,))
    vals = cursor.fetchall()
    return vals

@app.get("/getalltables")
def getalltables():
    cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    """)
    tables = cursor.fetchall()
    # create a hashmap for all tables
    tablevals = dict()
    for table in tables:
        tablevals[table[0]] = {"values" : getallfromtable(table[0]), "columns" : getcolumnsfromtable(table[0])}
    return tablevals

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
def DELETE_SEND(item : Item) -> bool:
    print("THIS IS WHAT?")
    try:
        print(item)
        # sending a SQL that corresponds to SELECT
        cursor.execute(item.sql)
        return True
    except:
        conn.rollback() # roll back the changes since this is not a valid command
        return False     

@app.post("/create_send")
def CREATE_SEND(item : CreateItem) -> bool:
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

@app.post("/gemini_request")
def GEMINI(item : Prompt):
    # giving the master prompt and the prompt item
    response = model.generate_content(f"Please explain what the list representation of our SQL commands will within 2 sentences: {item.prompt}")
    return response.text