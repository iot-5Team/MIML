import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from "react-slick";
import { useTheme } from '../../../context/themeProvider.js';

const Banner = () => {
  const navigate = useNavigate();

  const readButtonClick = () => {
    navigate('/read');
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    arrows: true,
    draggable: true,
  };

  const [userInfo, setUserInfo] = useState(null);
  const serverIP = process.env.REACT_APP_SERVER_URL;
  const [userId, setUserId] = useState('');
  const [userThema, setUserThema] = useState([]);
  const [slideData , setSlideData] = useState([]);
  let cardList = new Array();
  const [themeMode] = useTheme();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${serverIP}/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
        setUserThema(response.data.thema);
        setUserId(response.data.userId);
        
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
    

  }, [serverIP]);
  useEffect(() => {
    if (userThema.length > 0) {  // userThema가 업데이트되었는지 확인
      const ThemaData = async () => {
        try {
          const responseThema = await axios.post(`${serverIP}/book/random/thema`, userThema);
          cardList = responseThema.data;
          setSlideData(responseThema.data);
          console.log(responseThema.data);
        } catch (error) {
          console.error("테마 데이터 전송 에러:", error);
        }
      };
      ThemaData();
    }

  }, [userThema, serverIP]);

  return (
    <DataAggregatorWrapper>
      <SlideContainer {...settings}>
        {slideData.map((book) => (
          <div key={book.bookid} className="banner">
            <DataAggregator>
              <DataAggregatorInner>
                <FrameParent>
                  <AuthorOfAugustWrapper>
                    <AuthorOfAugust>
                      <AuthorOfAugustText>{book.author}</AuthorOfAugustText>
                    </AuthorOfAugust>
                  </AuthorOfAugustWrapper>
                  <Parent>
                    <H1>{book.title}</H1>
                    <TextDiv>
                      <Paragraph>{book.story}</Paragraph>
                      
                    </TextDiv>
                  </Parent>
                  <GhostButton onClick={readButtonClick}>
                    <RequestACall>눈과 귀로 읽으러 가기</RequestACall>
                  </GhostButton>
                </FrameParent>
              </DataAggregatorInner>
              <ImageWrapper>
                <ImageIcon loading="lazy" alt={book.title} src={`BookImg/${book.bookid}.png`} />
              </ImageWrapper>
            </DataAggregator>
          </div>
        ))}
      </SlideContainer>
    </DataAggregatorWrapper>
  );
};


export default Banner;

const DataAggregatorWrapper = styled.section`
  display: flex;
  flex-direction: row;
  
  max-width: 100%;
  margin: 0 calc((100% - 1600px) / 2);
  padding: 40px var(--padding-xl); /* 여백 추가 */
  box-sizing: border-box;
  text-align: left;
  font-size: var(--h1-size);
  color: var(--black);
  font-family: var(--body-text);

  @media screen and (max-width: 1200px) {
    flex-wrap: wrap;
  }
`;


const DataAggregator = styled.div`
  width: 1100px;
  display: flex;

  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 38.8px;

  @media screen and (max-width: 1200px) {
    flex-wrap: wrap;
  }

  @media screen and (max-width: 825px) {
    gap: 38.8px 19px;
  }
`;

const DataAggregatorInner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-width: 396px;
  min-height: 451px;

  @media screen and (max-width: 1200px) {
    min-height: auto;
  }

  @media screen and (max-width: 825px) {
    min-width: 100%;
  }
`;

const FrameParent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 512.9px;
  gap: 23.8px;
  max-width: 100%;
`;

const AuthorOfAugustWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding-bottom: 7.3px;
`;

const AuthorOfAugust = styled.button`
  cursor: pointer;
  border: 1px solid var(--violet);
  padding: var(--padding-3xs) var(--padding-5xs) var(--padding-3xs) var(--padding-3xs);
  background-color: transparent;
  border-radius: var(--br-10xs);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  
  &:hover {
    background-color: var(--color-darkslateblue-300);
    border: 1px solid var(--color-darkslateblue-200);
  }
`;

const AuthorOfAugustText = styled.div`
  position: relative;
  font-size: var(--font-size-sm);
  line-height: 21px;
  font-family: var(--body-text);
  color: var(--violet);
  text-align: left;
  display: inline-block;
  min-width: 112px;
`;

const Parent = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--gap-4xl-5);
`;

const H1 = styled.h1`
  font-size: inherit;
  line-height: 60px;
  font-weight: 700;
  color: ${props => props.theme === 'light' ? '#333' : '#fff'}; /* 대비 높은 색상 */
  
  @media screen and (max-width: 825px) {
    font-size: var(--h2-size);
    line-height: 48px;
  }

  @media screen and (max-width: 450px) {
    font-size: var(--font-size-10xl);
    line-height: 36px;
  }
`;

const TextDiv = styled.div`
  width: 477.7px;
  position: relative;
  font-size: var(--body-text-size);
  line-height: 24.03px;
  color: var(--body-text);
  display: inline-block;
`;

const Paragraph = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textColor || '#333'}; /* 대비 높은 색상 */
`;

const GhostButton = styled.button`
  cursor: pointer;
  border: 0;
  padding: 12.1px var(--padding-13xl) 11.9px 32.1px;
  background-color: var(--purple);
  border-radius: var(--br-11xs);
  color: white;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  white-space: nowrap;

  &:hover {
    background-color: #6a4f9a; /* 버튼 호버 색상 */
  }
`;

const RequestACall = styled.div`
  position: relative;
  font-size: var(--body-text-size);
  line-height: 24.03px;
  font-weight: 500;
  font-family: var(--body-text);
  color: var(--white);
  text-align: left;
  white-space: nowrap;
`;

const ImageWrapper = styled.div`
  height: 493px;
  width: 325px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding-bottom: var(--padding-9xl);
  box-sizing: border-box;
  max-width: 100%;
  margin-top: 30px;
  margin-right: 3%;
  margin-left: 3%;
`;

const ImageIcon = styled.img`
  align-self: stretch;
  margin: 0 auto;
  flex: 1;
  position: relative;
  max-width: 80%;
  overflow: hidden;
  max-height: 80%;
  object-fit: cover;
  z-index: 1;
  margin-bottom: 18%;
`;

const SlideContainer = styled(Slider)`
  width: 100%;
  position: relative;

  
  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slick-prev, .slick-next {
    z-index: 2;
    width: 20px; /* 화살표 크기 */
    height: 25px;
    
    background-size: contain;
    color: gray;

    &::before {
      font-size: 24px;
      color:gray;
    }
  }

  .slick-prev {
    left: -60px; /* 왼쪽 여백 */
  }

  .slick-next {
    right: -60px; /* 오른쪽 여백 */
  }
`;

