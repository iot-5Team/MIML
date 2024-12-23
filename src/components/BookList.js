import styled from "styled-components";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { icons } from '../assets/image.js';

const Booklist = () => {
    
    const [bookdata, setdata] = useState([]);
    const [bookPage, setBookPage] = useState(1);
    const [aiBookPage, setAiBookPage] = useState(10);
    const [bookAidata, setAidata] = useState([]);
    // imageUrlArray와 AiImageUrlArray를 상태로 선언
    const [imageUrlArray, setImageUrlArray] = useState([]);
    const [AiImageUrlArray, setAiImageUrlArray] = useState([]);
    const [userId,setUserId] = useState('');
    const serverIP = process.env.REACT_APP_SERVER_URL;
    const [userInfo, setUserInfo] =useState(null);
    const [likedBooks, setLikedBooks] = useState([]); // 추가: 좋아요한 책 리스트
    const [bookId, setBookId] = useState("");
    const [userpage,setUserPage] = useState(0);
    const [bookLast,setBookLast] = useState(0);


    
    const navigate = useNavigate();

     
    //유저 데이터를 가져오는 마운팅 코드
    useEffect(()=>{
        const fetchUserInfo = async () => {
           const token = localStorage.getItem("token");
           console.log("dasd");
           try {
               const response = await axios.get(`${serverIP}/user-info`, {
                   headers: {
                       Authorization: `Bearer ${token}`
                   }
               });
               setUserInfo(response.data);
               setUserId(response.data.userId);
               console.log('유저 데이터 가져온 상태:',response.data);
               console.log('유저 id 세팅',response.data.userId);
           } catch (error) {
               console.error("Error fetching user info:", error);
               // 에러 처리 (예: 로그인 페이지로 리다이렉트)
           }
       };
  
       fetchUserInfo();
   }, []);

   useEffect(() => {
    if (userId) {
        axios.get(`${serverIP}/book/${userId}/findLike`)
            .then((res) => {
                setLikedBooks(res.data.map(item => item.bookId));
                // window.location.reload();
            })
            .catch((error) => { 
                console.log(error); 
                handleClick();
            });
    }
}, [userId]); // userId를 의존성으로 설정


    useEffect(() => {
        // bookdata가 변경될 때마다 imageUrlArray 업데이트
        setImageUrlArray(bookdata.map(item => `/BookImg/${item.bookid}.png`));

        // 선문대 학사(진) 정윤식 전문가의 조언, 자문을 받아 완성한 코드 
        if (userId) {
            axios.get(`${serverIP}/book/${userId}/findLike`)
                .then((res) => {
                    setLikedBooks(res.data.map(item => item.bookId));
                    
                })
                .catch((error) => { 
                    console.log(error) 
                    handleClick()
                });
        }
    }, [bookdata]);

    useEffect(() => {
        // bookAidata가 변경될 때마다 AiImageUrlArray 업데이트
        setAiImageUrlArray(bookAidata.map(item => `/BookImg/${item.bookid}.png`));
    }, [bookAidata]);   

    useEffect(() => {
        const serverIP = process.env.REACT_APP_SERVER_URL;

        axios.get(`${serverIP}/book/find/${bookPage}`)
            .then((res) => {
                console.log(res);
                const receivedData = res.data;
                const newDataArray = receivedData.map(item => ({
                    bookid: item.bookid,
                    imageUrl: item.bookid,
                    page: item.page,
                    author: item.author,
                    publisher: item.publisher,
                    story: item.story,
                    price: item.price,
                    theme: item.theme,
                    title: item.title
                }));
                setdata(newDataArray);
            })
            .catch((error) => { console.log(error) });
    }, [bookPage]);

    useEffect(() => {
        const serverIP = process.env.REACT_APP_SERVER_URL;
        axios.get(`${serverIP}/book/findAi/${aiBookPage}`)
            .then((resAi) => {
                console.log(resAi);
                console.log("asdasdas");
                const receivedDataAi = resAi.data;
                const newDataArrayAi = receivedDataAi.map(item2 => ({
                    bookid: item2.bookid,
                    page: item2.page,
                    author: item2.author,
                    publisher: item2.publisher,
                    story: item2.story,
                    price: item2.price,
                    theme: item2.theme,
                    title: item2.title
                }));
                setAidata(newDataArrayAi);
            })
            .catch((error) => { console.log(error) });
    }, [aiBookPage]);
    //일반도서 더하기
    const handleNextPage = () => {
        setBookPage(prevPage => prevPage + 1);
    };
    //일반도서 빼기
    const handlePreviousPage = () => {
        if (bookPage > 1) {
            setBookPage(prevPage => prevPage - 1);
        }
    };
    //ai 도서 더하기
    const handleNextPage2 = () => {
        setAiBookPage(prevPage => prevPage + 1);
    };
    //ai 도서 빼기
    const handlePreviousPage2 = () => {
        if (aiBookPage > 1) {
            setAiBookPage(aiBookPage => aiBookPage - 1);
        }
    };
    const fetchPage = async (bookId) => {
        try {
            console.log(bookId+"북아이디 확인중");
            const response = await axios.get(`${serverIP}/book/bookmark/page/${userInfo.nickname}/${bookId}`);
            console.log("북마크 페이지:", response.data);
            return response.data;
        } catch (error) {
            console.error("페이지 조회 오류:", error);
        }
    };
    //명재가 짠거 
    const handleReadButtonClick = async (bookId) => {
        const userPage = await fetchPage(bookId);
        const selectedBook = bookdata.find(book => book.bookid === bookId);
        
        if (selectedBook) {
            navigate("/read", { 
                state: { 
                    props: bookId,
                    lastpage: selectedBook.page,
                    userpage: userPage,
                    thema: selectedBook.theme,
                    title: selectedBook.title,
                }
            });
        }
    };
    const handleReadButtonClickAi = async (bookId) => {
        const userPage = await fetchPage(bookId);
        const selectedBook = bookAidata.find(book => book.bookid === bookId);
        
        console.log(selectedBook.page,userPage+"값좀 확인 할게")

        if (selectedBook) {
            navigate("/read", { 
                state: { 
                    props: bookId,
                    lastpage: selectedBook.page,
                    userpage: userPage,
                    thema: selectedBook.theme,
                    title: selectedBook.title,
                }
            });
        }
    };

    // 이미지 상태 관리
    const [liked, setLiked] = useState(false);

    // 클릭 이벤트 핸들러
    const handleClick = (bookId) => {
        if (userId == null) return;
    
        // 좋아요 상태 토글
        const updatedLikedBooks = likedBooks.includes(bookId)
            ? likedBooks.filter(id => id !== bookId) // 이미 좋아요를 눌렀다면 배열에서 제거
            : [...likedBooks, bookId]; // 아니라면 배열에 추가
    
        setLikedBooks(updatedLikedBooks);
    
        const data = {
            bookId: Number(bookId),
            userId: String(userId)
        };
    
        // 좋아요 상태 서버로 전송
        axios.post(`${serverIP}/user/likeBook`, data, { headers: { "Content-Type": 'application/json' } })
            .catch((e) => {
                console.error('좋아요 리스트를 삭제/추가하는 도중에 에러가 발생했습니다. error code:', e);
            });
    };



    return (
        <div>
            <MainBox>
                <div style={{ fontWeight: 'bold', fontSize: '30px', float: 'left' }}>
                    AI 지원 도서
                </div>
                <SecondBox>
                    <ButtonContainer>
                        <ButtonPrev onClick={handlePreviousPage2}>←</ButtonPrev>
                    </ButtonContainer>
                    <div style={{marginTop:"10px"}}>
                    <BookBox>
                        {bookAidata.map((item2, index) => (
                            <Book key={index}>
                                <Link to={`/details/${item2.title}`}>
                                    <BookImg src={AiImageUrlArray[index]} alt="Book Cover" />
                                </Link>
                                <div style={{ height: '20px' }}></div>
                                <BookTitle>{item2.title}</BookTitle>
                                <BookWriter>{item2.author}</BookWriter>
                                <BookTranslator>{item2.publisher}</BookTranslator>
                                <BookPriceLike>
                                    <BookPrice>{item2.price.toLocaleString('ko-KR')}원</BookPrice>
                                    <BookLike
                                        src={likedBooks.includes(item2.bookid) ? icons.like : icons.like_before} // 변경된 부분: likedBooks 상태에 따라 이미지 변경
                                        alt="bookmark"
                                        onClick={() => handleClick(item2.bookid)} // 클릭 이벤트 핸들러 추가
                                        style={{ cursor: 'pointer' }}
                                    />
                                </BookPriceLike>
                                
                                <div style={{ height: '20px' }}></div>
                                    <BookReadBox onClick={() => handleReadButtonClickAi(item2.bookid)}> 
                                    <BookReadButton  >
                                       눈과 귀로 읽으러 가기
                                    </BookReadButton>
                                    </BookReadBox>
                            </Book>
                        ))}
                    </BookBox>
                    </div>
                    <ButtonContainer>
                        <ButtonNext  onClick={handleNextPage2}>→</ButtonNext>
                    </ButtonContainer>
                </SecondBox>
                <div style={{ height: "20px", marginTop: "100px" }}></div>
                <div style={{ fontWeight: 'bold', fontSize: '30px', float: 'left'}}>
                    일반 도서
                </div>
                <SecondBox>
                    <ButtonContainer>
                        <ButtonPrev onClick={handlePreviousPage}>←</ButtonPrev>
                    </ButtonContainer>
                    <div>
                        <BookBox>
                            {bookdata.map((item, index) => (
                                <Book key={index}>
                                    <Link to={`/details/${item.title}`}>
                                        <BookImg src={imageUrlArray[index]}/>
                                    </Link>
                                    <div style={{ height: '20px' }}></div>
                                    <BookTitle>{item.title}</BookTitle>
                                    <BookWriter>{item.author}</BookWriter>
                                    <BookTranslator>{item.publisher}</BookTranslator>
                                    <BookPriceLike>
                                        <BookPrice>{item.price.toLocaleString('ko-KR')}원</BookPrice>
                                        <BookLike
                                        src={likedBooks.includes(item.bookid) ? icons.like : icons.like_before} // 변경된 부분: likedBooks 상태에 따라 이미지 변경
                                        alt="bookmark"
                                        onClick={() => handleClick(item.bookid)} // 클릭 이벤트 핸들러 추가
                                        style={{ cursor: 'pointer' }}
                                    />
                                    </BookPriceLike>
                                    <div style={{ height: '20px' }}></div>
                                        <BookReadBox onClick={() => handleReadButtonClick(item.bookid)}>
                                            <BookReadButton >
                                                눈과 귀로 읽으러 가기
                                            </BookReadButton>
                                        </BookReadBox>
                                </Book>
                            ))}
                        </BookBox>
                    </div>
                    <ButtonContainer>
                        <ButtonNext onClick={handleNextPage}>→</ButtonNext>
                    </ButtonContainer>
                </SecondBox>
            </MainBox>
        </div>
    )
}

const MainBox = styled.div`
    width: 1350px;
    border: 2px solid;
    border-color: ${({ theme }) => theme.bgColor || '#ffffff'};
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;
`;

const SecondBox = styled.div`
    display: flex;
    flex-direction: row;
    margin-Top:40px;
    align-items: center;


`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;


`;

const BookBox = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 50px;
    margin-top: 30px;
    margin-left: 0px;

`;

const Book = styled.div`
    width: 282px;
    height: 580px;
    margin-top: 30px;
    margin: 0px;
    @media (max-width: 768px) {
        width: 45%;
    }
`;

const BookImg = styled.img`
    width: 100%;
    height: 400px;

    margin: 0 auto;
`;

const BookTitle = styled.div`
    height: 30px;
    vertical-align: middle;
    font-weight: bold;
`;

const BookWriter = styled.div`
    margin-top:20px;
    font-size: 12px;
`;

const BookTranslator = styled.div`
    font-size: 12px;
`;

const BookPrice = styled.div`
    font-size: 13px;
    font-weight: bold;
`;

const BookPriceLike = styled.div`
    display: flex;
    justify-content: space-between;
`;

const BookLike = styled.img`
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const BookReadBox = styled.div`
    width: 100%;
    height: 20px; 
    background-color: #937DC2;
    border-radius: 2px;
    display: flex; 
    justify-content: center; 
    align-items: center; 
    padding: 10px 0; 
    cursor: pointer;
`;

const BookReadButton = styled.button`
    background-color: transparent;
    color: white; 
    display: block; 
    border: 0px ;
    cursor: pointer;
`;

const ButtonNext = styled.button`
    width: 30px;
    height: 30px;
    font-size: 40px;
    border-radius: 30px;
    border : none;
    margin: 0px;
    cursor: pointer;
    background-color:transparent;
    color: gray;


`;

const AiBookBox = styled.div``;

const TitleBox = styled.div`
    float: left;
    margin-right: 20px;
`;

const ButtonPrev = styled(ButtonNext)`
    float: left;
    margin: 10px;
`;

export default Booklist;
