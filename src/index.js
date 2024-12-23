import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import "./global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider, ThemeToggleButton } from './context/themeProvider';
import { GlobalStyle } from './theme/GlobalStyle';


const root = ReactDOM.createRoot(document.getElementById('root'));

const currentTheme = 'light';

root.render(
  <BrowserRouter>
    <ThemeProvider theme={currentTheme}>
      
      <GlobalStyle/>
      <ThemeToggleButton />
        <App />
      
    </ThemeProvider>
  </BrowserRouter>
);

document.title = "MIML: 내 손 안의 AI 도서관";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
