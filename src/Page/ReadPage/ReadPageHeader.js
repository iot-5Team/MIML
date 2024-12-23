import { useCallback , useEffect } from "react";
import styles from './ReadPageHeader.module.css';
import { icons } from '../../assets/image.js';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import  axios  from "axios";

const Header = ({ bookId, onToggle }) => { // title과 onToggle 콜백 함수를 props로 받아옴
    const [isOn, setIsOn] = useState(false);
    const [bookTtile,setBookTitle] = useState('');
    const serverIP = process.env.REACT_APP_SERVER_URL;
    console.log(bookId+"해더 북 아이디");
    const handleClick = () => {
        setIsOn(!isOn);
        onToggle(!isOn); // isOn 상태를 전달받은 콜백 함수에 전달
    };

    const navigate = useNavigate(); // 네비게이션 기능 함수 정의 
    console.log("새로고침");

    // 클릭 시 첫 화면으로 돌아가는 이벤트 처리함수 
    const onAITextClick = useCallback(() => {
        navigate("/main");
    }, [navigate]);
    useEffect(( )=> {
        axios.get(`${serverIP}/book/title/${bookId}`)
        .then((req) => {
            console.log(req.data.title);
            setBookTitle(req.data.title);
        })
        .catch((err) => {
            console.log(err+"에러 발생 ");
        })

    })
    


    return (
        <>
            <section className={styles.parentLinkWrapper}>
                <div className={styles.parentLink}>
                    <div onClick={onAITextClick} className={styles.mainLogo}>
                        AI 도서관<br></br>
                        <div className={styles.MIML}>MIML</div>
                    </div>
                    <div className={styles.MusicIsMyLibrary}>
                        Music<br></br>Is My<br></br>Library
                    </div>
                    <div className={styles.Middle}>
                        {/* 현재 도서 제목을 표시 */}
                        <span>현재 도서 : {bookTtile}</span>
                        <span>텍스트만 보기 &nbsp;&nbsp;</span>
                    </div>
                    <div>
                        {/* 텍스트만 보기 ON, OFF 스위치 */}
                        <div className={isOn ? styles.switch_out : styles.switch} onClick={handleClick}>
                            <span className={styles.onoff_item}>ON&nbsp;&nbsp;&nbsp;</span>
                            <div className={styles.switch_in}>
                                <div className={`${styles.button} 
                                    ${isOn ? styles.on : styles.off}`} />
                            </div>
                            <span>OFF</span>
                        </div>
                    </div>
                    <div>
                        <input className={styles.searchBox} placeholder=" 줄거리 검색하기" />
                    </div>
                    <div className={styles.iconItem}>
                        <img src={icons.bookmark} alt="bookmark" className={styles.icon} />
                        <img src={icons.like} alt="like" className={styles.icon} />
                        <img src={icons.account} alt="account" className={styles.icon} />
                    </div>
                </div>
            </section>
        </>
    );
};

const Title = styled.h1`
    font-size: 12px;
    color: #333;
`;

export default Header;
