import React, { useState } from "react";
import Header from '../../components/layout/Header/Header.js';
import Footer from '../../components/layout/Footer/Footer.js';
import styled, { keyframes } from "styled-components";
import Slider from "react-slick";
import axios from 'axios';
import { Link } from "react-router-dom";
// 슬릭 CSS 파일
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 카테고리 배열
const categories = [
    "인기 도서",
    "신작",
    "남성 인기",
    "여성 인기",
    "판타지",
    "현판",
    "로판",
    "로맨스"
];

const serverIP = process.env.REACT_APP_SERVER_URL;
const settings = {
    className: "center",
    centerMode: true,
    dots: true,
    infinite: true,
    arrows: true,   // 화살표 표시
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    draggable: true,  // 드래그 기능 활성화
    centerPadding: "60px",
    cssEase: "linear",
};

const Category = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [clickedButton, setClickedButton] = useState(null); // 클릭된 버튼 상태 추가
    const [bookData, setBookData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const handleCategoryClick = async (category, index) => {
        setSelectedCategory(category);
        setClickedButton(index); // 클릭된 버튼의 인덱스를 저장
        setCurrentPage(1); // 카테고리 변경 시 페이지 번호 초기화

        try {
            const response = await axios.get(`${serverIP}/book/theme/${category}`);
            setBookData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleBackClick = () => {
        setSelectedCategory(null);
        setClickedButton(null); // 뒤로 가기를 누르면 선택 해제
        setCurrentPage(1);
    };

    // 페이지네이션 관련 함수들
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = bookData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Container>
            <HeaderWrapper>
                <Header />
            </HeaderWrapper>
            <CategoryBox>
                {categories.map((category, index) => (
                    <CategoryButton
                        key={index}
                        onClick={() => handleCategoryClick(category, index)}
                        isClicked={clickedButton === index} // 버튼 클릭 여부 전달
                    >
                        {category}
                    </CategoryButton>
                ))}
            </CategoryBox>
            {selectedCategory && (
                <CategoryListBox>
                    <CloseButton onClick={handleBackClick}>뒤로</CloseButton>
                    <h2>{selectedCategory}</h2>
                    <p>{selectedCategory}에 대한 자세한 내용...</p>
                    <SlideContainer {...settings}>
                        {currentBooks.map((book, index) => (
                            <MultiItem key={index}>
                                {book.image ? (
                                    <img src={`${process.env.PUBLIC_URL}/BookImg/default.png`} alt="Default Image" />
                                ) : (
                                    <Link to={`/details/${book.title}`}>
                                        <img src={`${process.env.PUBLIC_URL}/BookImg/${book.bookid}.png`} alt={book.title} />
                                    </Link>
                                )}
                                <p>{book.title}</p>
                            </MultiItem>
                        ))}
                    </SlideContainer>
                    <Pagination>
                        <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>이전</PageButton>
                        <PageButton onClick={handleNextPage} disabled={indexOfLastItem >= bookData.length}>다음</PageButton>
                    </Pagination>
                </CategoryListBox>
            )}
            <FooterWrapper>
                <Footer />
            </FooterWrapper>
        </Container>
    );
}

export default Category;

const slideUp = keyframes`
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const Container = styled.div`
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
`;

const HeaderWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
`;

const FooterWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
`;

const CategoryBox = styled.div`
    max-width: 700px;
    margin: 50px auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    justify-items: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
`;

const CategoryButton = styled.button`
    background-color: ${({ isClicked }) => isClicked ? '#7F6AAA' : '#937DC2'};  // 클릭 여부에 따른 배경색
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px 30px;
    cursor: pointer;
    font-size:  16px;
    transition: background-color 0.3s;
    color: white;
    width: 100%;

    &:hover {
        background-color: #5B477A;

    }

    ${({ isClicked }) => isClicked && `
        background-color: #5B477A;  // 클릭된 상태일 때 호버 상태 유지
    `}
`;

const CategoryListBox = styled.div`
    width: 100%;
    max-width: 1000px;
    height: 500px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    animation: ${slideUp} 0.5s ease-out forwards;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 40px;
    box-sizing: border-box;
    margin: 20px auto;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #ddd;
    }
`;

const MultiItem = styled.div`
  opacity: 1;
  transform: scale(1.04);
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 150px;
    height: auto;
    margin-bottom: 10px;
    margin: 0 auto;
  }

  p {
    margin: 0 auto;
    font-size: 14px;
  }
`;

const SlideContainer = styled(Slider)`
  width: 100%;  /* Ensure the slider occupies the full width */
  padding: 0 20px;
  .slick-slide {
    /* Ensure slides are displayed correctly */
    display: flex !important;  /* Ensure that slides are displayed */
    align-items: center;
    justify-content: center;
  }
  .center .slick-center ${MultiItem} {
    color: #e67e22;
    opacity: 1;
    transform: scale(1.08);
  }

  .center ${MultiItem} {
    opacity: 0.7;
    transition: all 300ms ease;
    transform: scale(0.99);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #ccc;
  }
`;
