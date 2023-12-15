import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./WishList.module.css"

const WishList = () => {
  const [userBooks, setUserBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    // Fetch user_books data from Firebase
    axios
      .get("https://mylibrary-47672-default-rtdb.firebaseio.com/wish_list.json")
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
  }, [userBooks]);

  const removeFromWishList = async (book) => {
    try {
      await axios.delete(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/wish_list/${book.key}.json`
      );

      // No immediate state update here
    } catch (error) {
      console.error("Error removing book from wish list:", error);
    }
    updateStateAfterDelete();
  };

  useEffect(() => {
    // Function to update state after the async operation
    const updateStateAfterDelete = async () => {
      try {
        const updatedBooks = userBooks.filter(
          (b) => b.key !== selectedBook.key
        );
        setUserBooks(updatedBooks);
        console.log("removed book from wish list: " + selectedBook.key);
      } catch (error) {
        console.error("Error updating state after delete:", error);
      }
    };

    if (selectedBook) {
      updateStateAfterDelete(); // Call the function within useEffect
    }
  }, [selectedBook, userBooks]);

  // Function to handle moving book to user books
  // (same as previously implemented)

  return (
    <div>
      <h1 className="">User Wish List</h1>
      <hr />

      {userBooks.length === 0 ? (
        <p>There are no items on the wish list.</p>
      ) : (
        <div className={`mx-4 px-4`}>
          {userBooks.map((book, index) => (
            <div key={index} className={` ${classes.wishList}`}>
              <h3>{book.title}</h3>
              <div className={classes.bookContent}>
              {book.coverId && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`}
                  alt={`Cover of ${book.title}`}
                  style={{
                    maxWidth: "100%",
                    marginRight: "2rem",
                    float: "left",
                  }}
                />
              )}
              <p>{book.description.value}</p>
              <div style={{ clear: "both" }}></div>

              </div>
              <button className={classes.wishButton} onClick={() => removeFromWishList(book)}>
                Remove from Wish List
              </button>
              <hr />

            </div>
            
          ))}

        </div>
      )}
    </div>
  );
};

export default WishList;
