import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/layout/Header/Header.js';
import Footer from '../../components/layout/Footer/Footer.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { icons } from '../../assets/image.js'; // 아이콘 경로를 맞춰주세요


const ListPage = () => {
    return (
        <div>
            <Header/>
            <Footer/>
        </div>

    )
}
export default ListPage;