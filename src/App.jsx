import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
// import OpenLibraryBooks from './pages/OpenLibraryBooks'; // Import the component fetching book data
import LibraryBooks from './pages/LibraryBooks';
import UserBookList from './pages/UserBookList';
import LoanedBooks from './pages/LoanedBooks';
import WishList from './pages/WishList';
import RootLayout from './pages/Root';
import EditBook from './UI/EditBook';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LibraryBooks /> },
      { path: "wishlist", element: <WishList /> },
      { path: "booklist", element: <UserBookList /> },
      { path: "loanedbooks", element: <LoanedBooks /> },
      { path: "edit-book/:id", element: <EditBook /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;