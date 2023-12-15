import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./LoanedBooks.module.css";

const LoanedBooks = () => {
  const [loanedBooks, setLoanedBooks] = useState([]);

  useEffect(() => {
    // Fetch user_books data from Firebase
    axios
      .get(
        "https://mylibrary-47672-default-rtdb.firebaseio.com/user_books.json"
      )
      .then((response) => {
        if (response.data) {
          const booksArray = Object.entries(response.data)
            .map(([key, value]) => ({ key, ...value }))
            .filter((book) => book.loaned); // Filter loaned books only
          setLoanedBooks(booksArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching user books:", error);
      });
  }, []);

  const returnToLibrary = async (book) => {
    try {
      const updatedBook = { ...book, loaned: false, loanedName: "" };
      await axios.put(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/user_books/${book.key}.json`,
        updatedBook
      );

      const updatedBooks = loanedBooks.filter((b) => b.key !== book.key);
      setLoanedBooks(updatedBooks);
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  return (
    <div>
      <h1>Loaned Books List</h1>
      <hr />
      {loanedBooks.length === 0 ? (
        <p>There are no items loaned out at this time.</p>
      ) : (
        <div className={classes.tableContainer}>
          <table>
            <tbody>
            <tr>
              <th>Book</th>
              <th>Loaned to</th>
              <th></th>
            </tr>
            {loanedBooks.map((book, index) => (
              <tr key={index}>
                <td>
                  <p>{book.title}</p>
                </td>
                {/* Display other book details */}
                <td>
                  <p>{book.loanedName}</p>
                </td>
                <td>
                  <button onClick={() => returnToLibrary(book)}>
                    Return to Library
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanedBooks;
