from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# ---------------------------------------------------
# DATABASE CONNECTION
# ---------------------------------------------------

DATABASE_URL = "sqlite:///./library.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ---------------------------------------------------
# DATABASE MODEL
# ---------------------------------------------------

class BookDB(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    year = Column(Integer)

# Create table automatically
Base.metadata.create_all(bind=engine)

# ---------------------------------------------------
# PYDANTIC MODEL
# ---------------------------------------------------

class Book(BaseModel):
    id: int
    title: str
    author: str
    year: int

# ---------------------------------------------------
# FASTAPI APP
# ---------------------------------------------------

app = FastAPI(
    title="Mini Library API with SQLite"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# GET ALL BOOKS
# ---------------------------------------------------

@app.get("/books", response_model=List[Book])
def get_books():

    db = SessionLocal()

    books = db.query(BookDB).all()

    db.close()

    return books

# ---------------------------------------------------
# GET BOOK BY ID
# ---------------------------------------------------

@app.get("/books/{id}", response_model=Book)
def get_book(id: int):

    db = SessionLocal()

    book = db.query(BookDB).filter(BookDB.id == id).first()

    db.close()

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book

# ---------------------------------------------------
# CREATE BOOK
# ---------------------------------------------------

@app.post("/books", response_model=Book)
def create_book(book: Book):

    db = SessionLocal()

    existing_book = db.query(BookDB).filter(BookDB.id == book.id).first()

    if existing_book:

        db.close()

        raise HTTPException(
            status_code=400,
            detail="Book ID already exists"
        )

    new_book = BookDB(
        id=book.id,
        title=book.title,
        author=book.author,
        year=book.year
    )

    db.add(new_book)

    db.commit()

    db.refresh(new_book)

    db.close()

    return book

# ---------------------------------------------------
# UPDATE BOOK
# ---------------------------------------------------

@app.put("/books/{id}", response_model=Book)
def update_book(id: int, updated_book: Book):

    db = SessionLocal()

    book = db.query(BookDB).filter(BookDB.id == id).first()

    if not book:

        db.close()

        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    book.title = updated_book.title
    book.author = updated_book.author
    book.year = updated_book.year

    db.commit()

    db.refresh(book)

    db.close()

    return Book(
        id=book.id,
        title=book.title,
        author=book.author,
        year=book.year
    )