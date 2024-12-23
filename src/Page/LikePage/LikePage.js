import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";
import {Link} from "react-router-dom";
import { useNavigate } from "react-router";
import Header from '../../components/layout/Header/Header.js';
import Footer from '../../components/layout/Footer/Footer.js';
import styles from '../../Page/miml_page/MimlMain.module.css';
import axios from "axios";

const ITEMS_PER_PAGE = 15;

const LikeBooks = () => {
    const location = useLocation();
    const [bookCount, setBookCount] = useState(0);
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('인기순');
    const serverIP = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate();
    useEffect(() => {
        if (location.state && location.state.results) {
            console.log('Received results:', location.state.results);
            
            // location.state.results가 배열인지 확인
            const resultsArray = Array.isArray(location.state.results) ? location.state.results : [];

            // bookId만 추출
            const bookIds = resultsArray.map(item => item.bookId);
            console.log('Extracted bookIds:', bookIds);

            // 각 bookId에 대해 개별적으로 요청 보내기
            const fetchBooks = async () => {
                const booksData = await Promise.all(bookIds.map(async (bookId) => {
                    try {
                        const res = await axios.get(`${serverIP}/books/title/${bookId}`);
                        return {
                            ...res.data,
                            imageUrl: `/BookImg/${bookId}.png`
                        };
                    } catch (err) {
                        console.error('An error occurred:', err.message);
                        return null;
                    }
                }));
                const validBooks = booksData.filter(book => book !== null); // 유효한 책만 필터링
                setBookCount(validBooks.length);
                setBooks(validBooks);
            };

            fetchBooks();
        }
    }, [location.state, serverIP]);

    // const filters = ['인기순', '정확도순', '신상품순', '등록일순', '최저가순', '최고가순', '평점순', '리뷰순'];

    const totalPages = Math.ceil(bookCount / ITEMS_PER_PAGE);

    const handleClickPage = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const selectedBooks = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className={styles.main}>
            <Header />
            <ItemBox>
                <ItemBox2>
                    <Title>좋아요 표시한 책 ({bookCount})</Title>
                    <Filters>
                        {/* {filters.map((filter) => (
                            <FilterButton
                                key={filter}
                                isSelected={selectedFilter === filter}
                                onClick={() => setSelectedFilter(filter)}
                            >
                                {filter}
                            </FilterButton>
                        ))} */}
                    </Filters>
                </ItemBox2>
            </ItemBox>
            <BooksBox>
                {selectedBooks.map((book, index) => (
                    <BookBox key={index}>
                        <Img src={book.imageUrl} alt={book.title} />
                        <BookInfo>
                            <BookTitle>[도서] {book.title}</BookTitle>
                            <Author>저자 {book.author}, 출판사 {book.publisher}</Author>
                            {/* <Publisher></Publisher> */}
                            {/* <Price>가격 {book.price.toLocaleString('ko-KR')}원</Price>
                            <PageCount>{book.page} 페이지</PageCount>
                            <Age>{book.age}세 이상</Age> */}
                            <Price>가격 {book.price ? book.price.toLocaleString('ko-KR') : '0'}원</Price>
                                <PageCount>{book.page ? book.page + ' 페이지' : '페이지 정보 없음'}</PageCount>
                                <Age>{book.age ? book.age + '세 이상' : '연령 정보 없음'}</Age>
                            <Story>{book.story}</Story>
                            <Theme>{book.theme}</Theme>
                        </BookInfo>
                        <BookBox2>
                            <BuyButton onClick={() => {navigate("/read", {state:{props:book.bookid}})}}>
                                읽으러 가기
                            </BuyButton>
                            <DetailsButton>
                                <Link to={`/details/${book.title}`} style={{ color: 'white', textDecoration: 'none' }}>
                                    자세히 보기
                                </Link>
                            </DetailsButton>
                        </BookBox2>
                    </BookBox>
                ))}
            </BooksBox>
            <Pagination>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PageButton 
                        key={page} 
                        onClick={() => handleClickPage(page)}
                        isSelected={page === currentPage}
                    >
                        {page}
                    </PageButton>
                ))}
            </Pagination>
            <Footer />
        </div>
    );
}

export default LikeBooks;

const BooksBox = styled.div`
    width: 1000px;
    margin: 0 auto;
    margin-top: 50px;
`;

const ItemBox = styled.div`
    width: 1000px;
    height: 140px;
    border: 2px solid;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
`;

const ItemBox2 = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const Filters = styled.div`
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
`;

const FilterButton = styled.button`
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    color: ${(props) => (props.isSelected ? '#007bff' : '#6c757d')};
    font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};

    &:hover {
        text-decoration: underline;
    }

    &:focus {
        outline: none;
    }
`;

const BookBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
`;

const Img = styled.img`
    width: 150px;
    height: 200px;
    margin-right: 20px;
`;

const BookInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left:30px;
`;

const BookTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
`;

const Author = styled.div`
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
`;

const Publisher = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
`;

const Price = styled.div`
    font-size: 20px;
    color: #e74c3c;
    margin-bottom: 10px;
`;

const PageCount = styled.div`
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
`;

const Age = styled.div`
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
`;

const Story = styled.div`
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 5px;
`;

const Theme = styled.div`
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 10px;
`;

const BookBox2 = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    align-items: flex-start;
`;

const BuyButton = styled.button`
    background-color: #4A9BB0;
    color: white;
    border: none;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 2px;
    margin-bottom: 10px;
    
    &:hover {
        background-color: #358693;
    }
`;

const DetailsButton = styled.button`
    background-color: #3368AE;
    color: white;
    border: none;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 2px;
    
    &:hover {
        background-color: #29538C;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
    
`;

const PageButton = styled.button`
    background: ${(props) => (props.isSelected ? '#007bff' : '#fff')};
    color: ${(props) => (props.isSelected ? '#fff' : '#007bff')};
    border: 1px solid #007bff;
    margin: 0 5px;
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
        background: #007bff;
        color: #fff;
    }

    &:focus {
        outline: none;
    }
`;
