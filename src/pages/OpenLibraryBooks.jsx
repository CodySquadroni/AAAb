import React, { useState, useEffect } from 'react';

const OpenLibraryBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://openlibrary.org/subjects/science-fiction.json?limit=10');
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (data.works) {
          setBooks(data.works);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle search input changes
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter books based on the search term
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Science Fiction Books from Open Library</h1>
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredBooks.map((book, index) => (
          <li key={index}>
            <h3>{book.title}</h3>
            {book.authors && (
              <p>
                <strong>Author:</strong> {book.authors[0]?.name || 'Unknown'}
              </p>
            )}
            {book.first_publish_year && (
              <p>
                <strong>First Published:</strong> {book.first_publish_year}
              </p>
            )}
            {book.cover_id && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                alt={`Cover of ${book.title}`}
                style={{ maxWidth: '150px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpenLibraryBooks;









// import React, { useState, useEffect } from 'react';

// const OpenLibraryBooks = () => {
//   const [books, setBooks] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://openlibrary.org/subjects/science-fiction.json?limit=100');
//         if (!response.ok) {
//           throw new Error('Network response was not ok.');
//         }
//         const data = await response.json();
//         // Assuming the API returns an array of books under "works" key
//         console.log(data.works);

//         if (data.works) {
//           setBooks(data.works);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <>
//     <div>
//       <h1>Science Fiction Books from Open Library</h1>
      
//       <ul>
//         {books.map((book, index) => (
//           <li key={index}>
//             <h3>{book.title}</h3>
            
//               <p>
//                 <strong>Author:</strong> {book.authors[0]?.name || 'Unknown'}
//               </p>
           
           
//               <p>
//                 <strong>First Published:</strong> {book.first_publish_year}
//               </p>
            
            
//               <img
//                 src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
//                 alt={`Cover of ${book.title}`}
//                 style={{ maxWidth: '150px' }}
//               />
            
//           </li>
//         ))}
//       </ul>
//     </div>
//     </>
//   );
// };

// export default OpenLibraryBooks;
