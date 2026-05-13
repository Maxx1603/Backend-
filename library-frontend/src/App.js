import React, { useEffect, useState } from "react";

function App() {

  // -------------------------------------
  // STATES
  // -------------------------------------

  const [books, setBooks] = useState([]);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");

  const [searchId, setSearchId] = useState("");

  const API_URL = "https://fastapi-library-backend.onrender.com";

  // -------------------------------------
  // GET ALL BOOKS
  // -------------------------------------

  const getAllBooks = async () => {

    try {

      const response = await fetch(`${API_URL}/books`);

      const data = await response.json();

      setBooks(data);

    } catch (error) {

      console.log(error);

    }
  };

  // -------------------------------------
  // GET BOOK BY ID
  // -------------------------------------

  const getBookById = async () => {

    try {

      const response = await fetch(
        `${API_URL}/books/${searchId}`
      );

      if (!response.ok) {

        alert("Book not found");

        return;
      }

      const data = await response.json();

      setBooks([data]);

    } catch (error) {

      console.log(error);

    }
  };

  // -------------------------------------
  // ADD BOOK (POST)
  // -------------------------------------

  const addBook = async () => {

    try {

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          id: Number(id),
          title: title,
          author: author,
          year: Number(year)
        })
      });

      const data = await response.json();

      if (!response.ok) {

        alert(data.detail);

        return;
      }

      alert("Book Added Successfully");

      getAllBooks();

      clearFields();

    } catch (error) {

      console.log(error);

    }
  };

  // -------------------------------------
  // UPDATE BOOK (PUT)
  // -------------------------------------

  const updateBook = async () => {

    try {

      const response = await fetch(
        `${API_URL}/books/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            id: Number(id),
            title: title,
            author: author,
            year: Number(year)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(data.detail);

        return;
      }

      alert("Book Updated Successfully");

      getAllBooks();

      clearFields();

    } catch (error) {

      console.log(error);

    }
  };

  // -------------------------------------
  // CLEAR INPUT FIELDS
  // -------------------------------------

  const clearFields = () => {

    setId("");
    setTitle("");
    setAuthor("");
    setYear("");
    setSearchId("");

  };

  // -------------------------------------
  // AUTO LOAD BOOKS
  // -------------------------------------

  useEffect(() => {

    getAllBooks();

  }, []);

  // -------------------------------------
  // UI
  // -------------------------------------

  return (

    <div
      style={{
        padding: "30px",
        fontFamily: "Arial"
      }}
    >

      <h1>Mini Library Frontend</h1>

      {/* -------------------------------- */}
      {/* ADD / UPDATE BOOK SECTION */}
      {/* -------------------------------- */}

      <div
        style={{
          border: "1px solid black",
          padding: "20px",
          marginBottom: "30px"
        }}
      >

        <h2>Add / Update Book</h2>

        <input
          type="number"
          placeholder="Book ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <br /><br />

        <button onClick={addBook}>
          Add Book
        </button>

        {" "}

        <button onClick={updateBook}>
          Update Book
        </button>

      </div>

      {/* -------------------------------- */}
      {/* SEARCH SECTION */}
      {/* -------------------------------- */}

      <div
        style={{
          border: "1px solid black",
          padding: "20px",
          marginBottom: "30px"
        }}
      >

        <h2>Search Book By ID</h2>

        <input
          type="number"
          placeholder="Enter Book ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        {" "}

        <button onClick={getBookById}>
          Search
        </button>

        {" "}

        <button onClick={getAllBooks}>
          Show All Books
        </button>

      </div>

      {/* -------------------------------- */}
      {/* BOOK LIST */}
      {/* -------------------------------- */}

      <div>

        <h2>Books List</h2>

        {books.map((book) => (

          <div
            key={book.id}
            style={{
              border: "1px solid gray",
              padding: "15px",
              marginBottom: "15px"
            }}
          >

            <h3>{book.title}</h3>

            <p>
              <strong>ID:</strong> {book.id}
            </p>

            <p>
              <strong>Author:</strong> {book.author}
            </p>

            <p>
              <strong>Year:</strong> {book.year}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;
