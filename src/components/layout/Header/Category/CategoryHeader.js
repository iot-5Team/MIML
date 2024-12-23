import React from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../theme/theme.js'; 


const CategoryHeader = () => {
    const navigate = useNavigate();
    const categories = [
        "인기도서",
        "신작",
        "남성인기",
        "여성인기",
        "판타지",
        "현판",
        "로판",
        "로맨스"
    ];
    
    const handleCategoryClick = async (category) => {
        console.log(`${category} 클릭됨`);
        
        try {
            navigate("/category");
        } catch (error) {
            console.error("서버 요청 에러:", error);
        }
    };
    
    return (
        <CategoryBody>
      {categories.map((category) => (
          <CategoryItem
          key={category}
          onClick={() => handleCategoryClick(category)}
          >
          {category}
        </CategoryItem>
      ))}
    </CategoryBody>
  );
};

export default CategoryHeader;


// CategoryBody 스타일 정의 // 스타일 컴포넌트 
const CategoryBody = styled.button`
  display: flex;
  width: 40%;
  flex-direction: row;
  justify-content: space-around;
  white-space: nowrap;
  border: 0px;
  background-color: ${({ theme }) => theme.bgColor || '#ffffff'}; // 테마에 따른 배경색
  color: ${({ theme }) => theme.textColor || '#ffffff'}; // 테마에 따른 배경색
  `;

// CategoryItem 스타일 정의
const CategoryItem = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  &:hover {
    // background-color: ${({ theme }) => theme.bgColor}; // 테마에 따른 hover 효과
  }
`;