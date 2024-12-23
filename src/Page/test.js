import BookList from '../components/BookList';
import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { aiImage } from '../assets/image';
import soonsin from '../assets/AiImage/soonsin.png'

function Test() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [aiImage.soonsin,aiImage.test]; // 이미지 파일 이름 리스트

  useEffect(() => {
    // 3초마다 currentIndex를 변경하여 화면을 자동으로 전환합니다.
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);

    // 컴포넌트가 언마운트되면 인터벌을 정리합니다.
    return () => clearInterval(intervalId);
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행됩니다.
//  useEffect(()=>{},[])
  return (
    <div className="banner">
      <img src={images[currentIndex]} alt="배너 이미지" />
    </div>
  );
}


const MainBox = styled.div`
    
`

export default Test;