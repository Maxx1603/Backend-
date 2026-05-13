from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional, List

from models.book_model import Book
from database.fake_db import books

router = APIRouter()

# -----------------------------------
# GET ALL BOOKS
# -----------------------------------
@router.get("/books", response_model=List[Book])
def get_books(author: Optional[str] = Query(None)):

    if author:
        filtered_books = [
            book for book in books
            if book["author"].lower() == author.lower()
        ]

        return filtered_books

    return books


# -----------------------------------
# GET BOOK BY ID
# -----------------------------------
@router.get("/books/{id}", response_model=Book)
def get_book(id: int = Path(...)):

    for book in books:

        if book["id"] == id:
            return book

    raise HTTPException(
        status_code=404,
        detail="Book not found"
    )


# -----------------------------------
# CREATE BOOK
# -----------------------------------
@router.post("/books", status_code=201)
def create_book(book: Book):

    for existing_book in books:

        if existing_book["id"] == book.id:

            raise HTTPException(
                status_code=400,
                detail="Book ID already exists"
            )

    books.append(book.dict())

    return book


# -----------------------------------
# UPDATE BOOK
# -----------------------------------
@router.put("/books/{id}")
def update_book(id: int, updated_book: Book):

    for index, book in enumerate(books):

        if book["id"] == id:

            books[index] = updated_book.dict()

            return updated_book

    raise HTTPException(
        status_code=404,
        detail="Book not found"
    )