import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../UI/Card";
import classes from "./UserBookList.module.css";

const UserBookList = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [note, setNote] = useState("");
  const [loanedBook, setLoanedBook] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Fetch user_books data from Firebase
    axios
      .get(
        "https://mylibrary-47672-default-rtdb.firebaseio.com/user_books.json"
      )
      .then((response) => {
        if (response.data) {
          const booksArray = Object.entries(response.data).map(
            ([key, value]) => ({ key, ...value })
          );
          setUserBooks(booksArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching user books:", error);
      });
  }, []);

  const handleOk = async () => {
    addToLoaned(loanedBook);
    setShowModal(false);
    setNote("");
    setLoanedBook([]);
  };

  const handleRead = () => {
    updateReading(selectedBook);
    setShowReading(false);
    selectedBook(null);
    setPage(0);
  };

  // Function to sort books by title
  const sortByTitle = () => {
    const sortedBooks = [...userBooks].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
    setUserBooks(sortedBooks);
  };

  // Function to sort books by title
  const sortByAuthor = () => {
    const sortedBooks = [...userBooks].sort((a, b) => {
      const authorA = a.author.toLowerCase();
      const authorB = b.author.toLowerCase();
      if (authorA < authorB) {
        return -1;
      }
      if (authorA > authorB) {
        return 1;
      }
      return 0;
    });
    setUserBooks(sortedBooks);
  };

  const closeModal = () => {
    setShowModal(false);
    setNote(""); // Clear the note when the modal is closed
  };

  const closeRead = () => {
    setShowReading(false);
    setPage(""); // Clear the page number when the modal is closed
  };

  const removeFromUserList = async (book) => {
    try {
      await axios.delete(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/user_books/${book.key}.json`
      );

      const updatedBooks = userBooks.filter((item) => item.key !== book.key);
      setUserBooks(updatedBooks);
      console.log("removed book");
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  const popUp = (book) => {
    setSelectedBook(book);
    setLoanedBook(book);
    setShowModal(true);
  };

  const readingPopUp = (book) => {
    setSelectedBook(book);
    setShowReading(true);
  };

  const updateReading = async (book) => {
    try {
      const updatedBook = { ...book, pageOn: page, read: "ip" };
      console.log("reading.........: " + book.key);
      // Send request to update server with loaned status
      await axios.put(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/user_books/${book.key}.json`,
        updatedBook
      );

      console.log(book.key);
      const updatedBooks = userBooks.map((item) =>
        item.key === book.key ? updatedBook : item
      );
      setUserBooks(updatedBooks);
      console.log("Loan updated for the book");
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };
  const addToLoaned = async (book) => {
    try {
      // setShowModal(true);
      const updatedBook = { ...book, loaned: true, loanedName: note };
      console.log("loanedddddd: " + book.key);
      // Send request to update server with loaned status
      await axios.put(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/user_books/${book.key}.json`,
        updatedBook
      );

      console.log(book.key);
      const updatedBooks = userBooks.map((item) =>
        item.key === book.key ? updatedBook : item
      );
      setUserBooks(updatedBooks);
      console.log("Loan updated for the book");
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  return (
    <div className={classes.userBookList}>
      <h1>User Book List</h1>
      <hr />
      <button onClick={sortByTitle}>Sort by Title</button>
      <button onClick={sortByAuthor}>
        Sort by Author(First Name or Initial)
      </button>

      <div className={` ${classes.cardRow}`}>
        <div className={` ${classes.cardCol}`}>
          {userBooks
            .filter((book) => !book.loaned) // Filter books where loaned is false
            .map((book, index) => (
              <div key={index} className={classes.cards}>
                <Card key={index} book={book} />
                <div className={`text-center ${classes.buttons}`}>
                  <button onClick={() => readingPopUp(book)}>
                    Start Reading
                  </button>
                  <button onClick={() => popUp(book)}>Loaned</button>
                  <button onClick={() => removeFromUserList(book)}>
                    Remove
                  </button>
                </div>
                {showModal && selectedBook.key == book.key && (
                  <div className={classes.popup}>
                    <div className="text-center">
                      <p>Borrower's Name: </p>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{width: "250px", height: "30px"}}
                      />
                      <br /><br />
                      <button onClick={handleOk}>OK</button>
                      <button onClick={closeModal}>Cancel</button>
                    </div>
                  </div>
                )}

                {showReading && selectedBook.key == book.key &&(
                  <div className={classes.popup}>
                    <div className="text-center">
                      <p style={{}}>Current Page: </p>
                      <textarea
                        value={page}
                        onChange={(e) => setPage(e.target.value)}
                        style={{width: "75px", height: "30px"}}
                      />
                      <br /><br />
                      <button onClick={handleRead}><i class="fas fa-check"></i></button>
                      <button onClick={closeRead}><i class="fas fa-times"></i></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <br /><br /><br />
    </div>
  );
};

export default UserBookList;
