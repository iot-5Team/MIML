import Header from '../../components/layout/Header/Header.js';
import Footer from '../../components/layout/Footer/Footer.js';
import styles from './MimlMain.module.css';
import BookList from '../../components/BookList.js';
import Banner from "../../components/layout/Banner/Banner.js";
import React ,{useEffect, useState} from "react";
import axios from 'axios';
const MimlMain=()=>{
   
return (
   <div className={styles.main}>
    <Header/>
    <Banner />

    <BookList/>
    <Footer/>
   </div>
)
}
export default MimlMain;