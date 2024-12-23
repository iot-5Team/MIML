import {useEffect} from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigationType,
  Link,
  BrowserRouter,
} from 'react-router-dom'
import MimlMain from "../src/Page/miml_page/MimlMain.js";
import Test from './Page/test.js'
import ReadPage from "../src/Page/ReadPage/ReadPage.js";
import Login from "./Page/LoginPage/Login.js"
import Join from "./Page/JoinPage/Join.js"
import MyPage from "./Page/MyPage/MyPage.js";
import BookDetails from "./Page/BookDetails/BookDetails.js";
import SearchBooks from "./Page/SearchBooks/SearchBooks.js";
import LikePage from "./Page/LikePage/LikePage.js";
import Category from "./Page/Category/Category.js";
import ListPage from "./Page/ListPage/ListPage.js";
import QuizPage from "./Page/QuizPage/QuizPage.js";
// import "./App.css";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(()=>{
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  },[action, pathname]) //액션과 pathname이 변경되었을 때 스크롤위치를 맨 위로 되돌리는 기능

  return (
    // <div className="DarkMode">
      <Routes>
        <Route path="/Main" element={<MimlMain/>}> </Route>
        {/* <Route path="/book" element={<MimlBookDescription/>}> </Route> */}
        <Route path="/test" element={<Test/>}> </Route>
        <Route path="/read" element={<ReadPage/>}> </Route>
        <Route path="/read/:title" element={<ReadPage/>}> </Route>
        <Route path="/read/:bookId" component={ReadPage} />
        <Route path="/" element={<Login/>}> </Route>
        <Route path="/join" element={<Join/>}> </Route>
        <Route path="/my" element={<MyPage/>}> </Route> 
        <Route path="/searchList" element={<SearchBooks/>}></Route>
        <Route path="/details/:title" element={<BookDetails />} /> 
        <Route path="/like" element={<LikePage />} /> 
        <Route path="/category" element={<Category />}></Route>
        <Route path="/list" element={<ListPage/>}></Route>
        <Route path="/quiz" element={<QuizPage/>}></Route>
      </Routes>
      // </div>
      
  );
}

export default App;
