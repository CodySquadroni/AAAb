import React, { useState } from "react";
import classes from "./Card.module.css";
import { Link } from "react-router-dom";

const Card = ({ book }) => {
  return (
    <div className={classes.card}>
      <h4 className="m-4">{book.title}</h4>

      {/* ... (existing code remains the same) */}
      <div className="text-center">
        {book.coverId && (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
            alt={`Cover of ${book.title}`}
            style={{ maxWidth: "100%" }}
          />
        )}
        <br />
      </div>
      {/* Display the status */}
      <div
        className={`text-center mb-4 pb-4 ${
          book.read == "ip"
            ? classes.inProgress
            : book.read == "c"
            ? classes.completed
            : book.read == "n"
            ? classes.notStarted
            : ""
        }`}
      >
        {book.read === "ip" ? (
          <p>In Progress</p>
        ) : book.read === "c" ? (
          <p>Read</p>
        ) : null}

        {book.starRating == 1 ? (
          <div className={classes.stars}>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </div>
        ) : book.starRating == 2 ? (
          <div className={classes.stars}>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </div>
        ) : book.starRating == 3 ? (
          <div className={classes.stars}>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
            <i class="far fa-star"></i>
          </div>
        ) : book.starRating == 4 ? (
          <div className={classes.stars}>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="far fa-star"></i>
          </div>
        ) : book.starRating == 5 ? (
          <div className={classes.stars}>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
        ) : null}
        
      </div>

      <div className={`text-end ${classes.editBook}`}>
        <Link
          to={{
            pathname: `/edit-book/${book.key}`,
            state: { page: "booklist" }, // Pass props here
          }}
        >
          <i className="far fa-edit"></i>
        </Link>
      </div>
    </div>
  );
};

export default Card;

// import React from "react";
// import classes from "./Card.module.css";

// const Card = ({ book }) => {
//   return (
//     <div className={classes.card}>
//       <h4 className="m-4">{book.title}</h4>

//       <div className="text-center">
//         {book.coverId && (
//           <img
//             src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
//             alt={`Cover of ${book.title}`}
//             style={{ maxWidth: "100%" }}
//           />
//         )}
//         <br />
//       </div>
//       <div className="text-center m-2">
//       <p>Author: {book.author}</p>

//       </div>
//       <div className={`text-center mb-4 pb-4 ${book.read === "ip" ? classes.inProgress : book.read === "c" ? classes.completed : book.read === "n" ? classes.notStarted : ''}`}>
//         {book.read === "ip" ? (
//           <p>In Progress</p>
//         ) : book.read === "finished" ? (
//           <p>Completed</p>
//         ) : null}{" "}
//       </div>

//     </div>
//   );
// };

// export default Card;
