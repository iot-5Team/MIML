import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './BookDetails.module.css';
import Header from '../../components/layout/Header/Header.js';
import Footer from '../../components/layout/Footer/Footer.js';
import BookList from '../../components/BookList.js';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { icons } from '../../assets/image.js'; // 아이콘 경로를 맞춰주세요
import { useTheme } from '../../context/themeProvider.js';

const BookDetails = () => {
    const navigate = useNavigate();
    const { title } = useParams();

    const [booktitle, setBookTitle] = useState("");
    const [bookauthor, setBookAuthor] = useState("");
    const [bookprice, setBookPrice] = useState("");
    const [bookpublisher, setBookPublisher] = useState("");
    const [booklanguage, setBookLanguage] = useState("");
    const [bookpublication_date, setBookPublication_date] = useState("");
    const [booktheme, setBookTheme] = useState("");
    const [bookage, setBookAge] = useState("");
    const [bookpage, setBookPage] = useState("");
    const [userpage,setUserPage] = useState(0);
    const [bookText, setBookText] = useState("");
    const [bookId, setBookId] = useState("");
    const [thema, setThema] = useState("");
    const [likedBooks, setLikedBooks] = useState([]); // 추가: 좋아요한 책 리스트
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState("")
    const [summary, setSummary] = useState("")
    const serverIP = process.env.REACT_APP_SERVER_URL;
    const [themeMode] = useTheme();
    const formattedPrice = bookprice.toLocaleString('ko-KR'); // 금액에 콤마 추가

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${serverIP}/user-info`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserId(response.data.userId);
                setNickname(response.data.nickname);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        

        fetchUserInfo();
       
    }, []);

    useEffect(() => {
        const serverIP = process.env.REACT_APP_SERVER_URL;

        axios.get(`${serverIP}/book/${title}`)
            .then((res) => {
                const receivedData = res.data;
                console.log(res.data+"출력 결과 확인 ");
                setBookTitle(receivedData.title);
                setBookAuthor(receivedData.author);
                setBookPrice(receivedData.price);
                setBookPublisher(receivedData.publisher);
                setBookLanguage(receivedData.language);
                setBookPublication_date(receivedData.publication_date);
                setBookTheme(receivedData.theme);
                setBookAge(receivedData.age);
                setBookPage(receivedData.page);
                setBookId(receivedData.bookid);
                setBookText(receivedData.story);
                setThema(receivedData.thema);
                setSummary(receivedData.summary);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [title]);

    useEffect(() => {
        if (userId) {
            axios.get(`${serverIP}/book/${userId}/findLike`)
                .then((res) => {
                    setLikedBooks(res.data.map(item => item.bookId));
                })
                .catch((error) => {
                    console.log(error);
                    console.log("에러발생");
                });
        }
    }, [userId]);
    const fetchPage = async () => {
            
        axios.get(`${serverIP}/book/bookmark/page/${nickname}/${bookId}`)
            .then((response) => {
                console.log("북마크 페이지!!!!!!:", response.data);

                setUserPage(response.data);
            })
            .catch((error) => {
                console.error("페이지 조회 오류:", error);
                console.log(nickname, bookId+"돼나");
            });
    };
    fetchPage();

    const handleClick = () => {
        if (userId == null) return;
    
        const updatedLikedBooks = likedBooks.includes(bookId)
            ? likedBooks.filter(id => id !== bookId)
            : [...likedBooks, bookId];
    
        setLikedBooks(updatedLikedBooks);
    
        const data = { bookId: Number(bookId), userId: String(userId) };
    
        axios.post(`${serverIP}/user/likeBook`, data, { headers: { "Content-Type": 'application/json' } })
            .catch((e) => {
                console.error('좋아요 리스트를 삭제/추가하는 도중에 에러가 발생했습니다. error code:', e);
            });
    };

    return (
        <DetailsBox>
            <Header />
            <br/><br/><br/>
            <div className={styles.main}>
                <div className={styles.bookImages}>
                    <img className={styles.bookImage} src={`/BookImg/${bookId}.png`} />
                </div>
                <div className={styles.bookDetails}>
                    <br/>
                    <titleName>{booktitle}</titleName><br/>
                    <grayText>{bookauthor}</grayText>
                    <h2>
                        ★★★★☆<br/>
                        {formattedPrice}원
                    </h2>
                    <BookText>{bookText}</BookText>
                    <button className={styles.purpleButton} onClick={() => navigate("/read", { state: 
                        { props: bookId,
                          lastpage:bookpage,
                          userpage:userpage,
                          thema:booktheme,
                          title:booktitle,
                        } 
                        })}>
                        <div className={styles.purpleButtonIn}>눈과 귀로 읽으러 가기</div>
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button className={styles.translucentButton} onClick={() => navigate("/quiz", { state: 
                        { props: bookId,
                          lastpage:bookpage,
                          userpage:userpage,
                          thema:booktheme,
                          title:booktitle,
                        } 
                        })}>
                        <div className={styles.translucentButtonIn}>AI 퀴즈 풀기</div>
                    </button>
                    {/* <button className={styles.translucentButton} onClick={handleClick}>
                        <div className={styles.translucentButtonIn}>
                            {likedBooks.includes(bookId) ? "위시리스트에서 제거" : "위시리스트 추가"}
                        </div>  //기존 위시리스트 추가 버튼
                    </button> */}
                    <BookLike
                        src={likedBooks.includes(bookId) ? icons.like : icons.like_before}
                        alt="bookmark"
                        onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <div className={styles.middle}>
                        <br/>
                        <midPurple>
                            <br/>출판사
                            <br/>출판일
                            <br/>쪽 수
                        </midPurple>
                        <mid>
                            <br/>{bookpublisher}
                            <br/>{bookpublication_date}
                            <br/>{bookpage} 페이지
                        </mid>
                        <midPurple>
                            <br/>언어
                            <br/>연령
                            <br/>장르
                        </midPurple>
                        <mid>
                            <br/>{booklanguage}
                            <br/>{bookage}세 이상
                            <br/>{booktheme}
                        </mid>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            <AiSummary>
                <p style={{fontSize:'30px', fontWeight: 'bold'}}>AI 요약</p>
                <AiSummaryBox theme={themeMode}>
                    <p style={{padding: '12px'}}> {summary}</p>
                </AiSummaryBox>
            </AiSummary>
            <BookList />
            <Footer />
        </DetailsBox>
    )
}

export default BookDetails;

const DetailsBox = styled.div`
    line-height: normal;
`;

const BookText = styled.div`
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 30px;
`;

const BookLike = styled.img`
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
`;

const AiSummary = styled.div`
    font-size: 18px;
    margin: 0 calc((100% - 1160px) / 2); //폭 조절

`;

const AiSummaryBox = styled.div`
    margin-top: 15px;
    height: 100px;
    border-radius: 15px;
    background-color:  ${props => props.theme === 'light' ? '#f5f5f5' : '#1a1823'};
`;