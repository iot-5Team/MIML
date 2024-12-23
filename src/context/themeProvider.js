import { lightTheme, darkTheme } from '../theme/theme';
import { createContext, useState, useContext, useCallback } from 'react';
import { ThemeProvider as StyledProvider } from 'styled-components';
import styled from 'styled-components';

// context 기본 형태
const ThemeContext = createContext({});
const ThemeProvider = ({children}) => {
  const LocalTheme = window.localStorage.getItem('theme') || 'light'; // 모드 상태 로컬 저장
  const [ThemeMode, setThemeMode] = useState(LocalTheme);
  const themeObject = ThemeMode === 'light' ? lightTheme : darkTheme;
  
  
  return(
    <ThemeContext.Provider value={{ ThemeMode, setThemeMode }}>
      <StyledProvider theme={themeObject}> 
        { children }
      </StyledProvider>      
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext);
  const { ThemeMode, setThemeMode } = context;

  const toggleTheme = useCallback(() => {
    if (ThemeMode === "light") {
      setThemeMode("dark");
      window.localStorage.setItem('theme', 'dark');
    }
    else {
      setThemeMode("light")
      window.localStorage.setItem('theme', 'light');
    };
  }, [ThemeMode]);
  
  return [ ThemeMode, toggleTheme];
}

// 다크모드/라이트모드 토글 버튼 컴포넌트
const ThemeToggleButton = () => {
  const [ThemeMode, toggleTheme] = useTheme();
  
  return (
    <StyledButton onClick={toggleTheme}>
      {ThemeMode === 'light' ? '☀️' : '🌙'}
    </StyledButton>
  );
}

export { ThemeProvider, useTheme, ThemeToggleButton };

// 모드 버튼 스타일
const StyledButton = styled.button` 
  
  border:none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.bgColor}; // 테마에 따른 배경색
  background-color:transparent;

  font-size: 30px;
  position: fixed;
  bottom: 20px;  /* 하단에서 20px */
  right: 20px;   /* 우측에서 20px */


  &:hover {
    // background-color: ${({ theme }) => theme.hoverColor}; // hover 시 색상
  }
`;