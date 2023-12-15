import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import classes from "./EditBook.module.css";

const EditBook = (props) => {
  const navigate = useNavigate(); 

  const location = useLocation();
  const { page } = location.state || {};
  const { id } = useParams(); // Get the book ID from URL parameters
  const [book, setBook] = useState({
    author: "",
    loaned: false,
    loanedName: "",
    note: "",
    pageOn: 0,
    read: "", // You can set default to any initial value like "ip", "c", "n", etc.
    starRating: 0,
  });

  const [errors, setErrors] = useState({ loanedName: "" });

  const validateForm = () => {
    const errorsCopy = { ...errors };
    if (book.loaned && !book.loanedName) {
      errorsCopy.loanedName = "Loaned Name is required";
    } else {
      errorsCopy.loanedName = "";
    }
    setErrors(errorsCopy);
    return !errorsCopy.loanedName;
  };

  useEffect(() => {
    // Fetch book details based on the ID
    axios
      .get(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/user_books/${id}.json`
      )
      .then((response) => {
        if (response.data) {
          setBook(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    // Perform actions to save changes, e.g., update book details in the database
    const isFormValid = validateForm();

    if (!isFormValid) {
      // Prevent form submission if the form is invalid
      return;
    }

    try {
      console.log("updated: " + book.key);
      const bookKey = book.key;

      // Send request to update server with loaned status
      await axios.put(
        `https://mylibrary-47672-default-rtdb.firebaseio.com/user_books/${bookKey}.json`,
        book
      );

      console.log(book);
      navigate("/booklist");
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const handleCancel = () => {
    navigate("/booklist");
  };

  return (
    <div className={`${classes.formContainer}`}>
      <h2>Edit Book</h2>
      <hr />
      <form onSubmit={handleSaveChanges}>
        <h4>{book.title}</h4>
        
        <label className={classes.formLabel}>Loaned:</label>
          <input
            type="checkbox"
            name="loaned"
            checked={book.loaned}
            onChange={() => setBook({ ...book, loaned: !book.loaned })}
          />
        <br /><br />
        {book.loaned && (
          <div>
            
            <label className={classes.formLabel}>Loaned Name:</label>
              <input
                type="text"
                name="loanedName"
                value={book.loanedName}
                onChange={handleInputChange}
              />
            
            {errors.loanedName && <p>{errors.loanedName}</p>}
            <br /><br />

          </div>
          
        )}

        <label className={classes.formLabel}>Page On: </label>
          <input
            type="number"
            name="pageOn"
            value={book.pageOn}
            onChange={handleInputChange}
          />
        <br /><br />

        <label className={classes.formLabel}>Read Status:</label>
          <select name="read" value={book.read} onChange={handleInputChange}>
            <option value="ip">In Progress</option>
            <option value="c">Completed</option>
            <option value="n">Not Started</option>
          </select>
          <br /><br />

        
        <label className={classes.formLabel}>Star Rating: <span>{book.starRating}</span></label>
          <input
            type="range"
            name="starRating"
            min="0"
            max="5"
            value={book.starRating}
            onChange={handleInputChange}
          />
        
        <br /><br />

        <label className={classes.formLabel}>Note:</label>
<br /><br />
          <textarea
            className={classes.textarea}
            name="note"
            value={book.note}
            onChange={handleInputChange}
          ></textarea>
                <br /><br />

        <button className={classes.formButton} type="submit">
          Save Changes
        </button>
        <button className={classes.formButton} onClick={handleCancel}>
          Cancel
        </button>
      </form>
      <br /><br /><br />
    </div>
  );
};

export default EditBook;
