import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LibraryBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchInProgress, setSearchInProgress] = useState(false);
  const [newBook, setNewBook] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    if (searchInProgress) {
      timeoutId = setTimeout(() => {
        fetchData();
        setSearchInProgress(false);
      }, 1000); // Adjust the delay as needed
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInProgress]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${searchTerm}`
      );
      console.log(response);

      if (response.status === 200) {
        const books = response.data.docs.map((book) => ({
            
          id: book.key,
          title: book.title,
          coverId: book.cover_i || null, // Use cover_i field or null if not available
          author: book.author_name ? book.author_name.join(", ") : "Unknown",
          publishDate: book.first_publish_year || "N/A",
          loaned: false, // Initial value for loaned
          loanedName: "",
          read: "", // Initial value for read
          note: "", // Initial value for notes
          pageOn: 0,
          readNotes: "",
          starRating: 0,
          description: "No description found",
        }));
        setSearchResults(books);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    setSearchInProgress(true);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearchInProgress(true);
    }
  };

  const addToUserList = (book) => {
    axios
      .post(
        "https://mylibrary-47672-default-rtdb.firebaseio.com/user_books.json",
        book
      )
      .then((response) => {
        console.log("Book added to user_books:", response.data);
        // Optionally update the state or perform any necessary actions after successful addition
        setSearchResults([]); // Clear search results after adding to user list
      })
      .catch((error) => {
        console.error("Error adding book to user_books:", error);
      });
      // navigate('/booklist');
  };

  const addToWishList = async (book) => {
    console.log(book.id)
    try {
      const response = await axios.get(`https://openlibrary.org${book.id}.json`);
      const bookDescription = response.data.description;
  
      if (bookDescription) {
        const bookWithDesc = { ...book, description: bookDescription };
        await axios.post("https://mylibrary-47672-default-rtdb.firebaseio.com/wish_list.json", bookWithDesc);
        console.log("Book added to wish_list");
        setSearchResults([]); // Clear search results after adding to user list
      }
    } catch (error) {
      console.error("Error adding book to wish_list:", error);
    }
    navigate('/wishlist');

  };

  const getInfo = (book) => {
    console.log(book);
  };

  return (
    <div>
      <h1>Library Books Search</h1>
      <input
        type="text"
        placeholder="Search books in the library..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSearch}>Search</button>

      {searchInProgress ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {searchResults.map((book, index) => (
            <li key={index}>
              <h3>{book.title}</h3>
              {book.author && (
                <p>
                  <strong>Author:</strong> {book.author || "Unknown"}
                </p>
              )}
              {book.publishDate && (
                <p>
                  <strong>First Published:</strong> {book.publishDate}
                </p>
              )}
              {book.coverId && (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`}
                  alt={`Cover of ${book.title}`}
                  style={{ maxWidth: "150px" }}
                />
              )}
              {/* New fields */}

              <button onClick={() => addToUserList(book)}>
                Add to My Books
              </button>
              <button onClick={() => addToWishList(book)}>
                Add to Wish List
              </button>
              <button onClick={() => getInfo(book)}>Get Info</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LibraryBooks;
