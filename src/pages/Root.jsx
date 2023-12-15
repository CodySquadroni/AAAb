import React from "react";
import {Outlet} from 'react-router-dom'
import MainNavigation from "../components/MainNavigation";
import Footer from "../components/Footer";

const RootLayout = () => {
  return(
  <>
    <MainNavigation />
    {/* <main className={classes.content}> */}
    <Outlet />
    {/* </main> */}
    <Footer />


  </>
  
)};

export default RootLayout;
