import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Header.module.css';
import CategoryHeader from './Category/CategoryHeader.js';
import { icons } from '../../../assets/image.js';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const serverIP = process.env.REACT_APP_SERVER_URL;
    const [userId, setUserId] = useState("admin");

    const searchBox = {
        searchBook: function(searchText) {
            axios.get(`${serverIP}/book/contain/${searchText}`, { params: { query: searchText } })
                .then(res => {
                    // 성공적으로 응답을 받은 경우 실행할 코드
                    
                    console.log('Response:', res.data);
                    navigate('/searchList', { state: { results: res.data } });
                })
                .catch(error => {
                    // 에러가 발생한 경우 실행할 코드
                    console.error('An error occurred:', error.message);
                });
        }
    };

    // like 버튼을 누를 때
    const likeButtonClick = () => {
        axios.get(`${serverIP}/book/${userId}/findLike`)
            .then(res => {
                console.log("res data: ", res.data )
                navigate('/like', { state: { results: res.data } });
            })
            .catch(error => {
                console.error('An error occurred:', error.message);
            });
        console.log('Like Button: ', userId);
    };
    

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchBox.searchBook(searchText);
        }
    };

    const onAITextClick = useCallback(() => {
        navigate("/main");
    }, [navigate]);


    const myButtonClick = () => {
        navigate('/my')
    }
    const myBookListClick = () => {
        navigate('/list');
    }
    
    // const likeButtonClick = () => {
        //     navigate('/like')
        // }
        
        return (
        <>
            <section className={styles.parentLinkWrapper}>
                <div className={styles.parentLink}>
                    <div onClick={onAITextClick} className={styles.mainLogo}>
                        AI 도서관<br />
                        <div className={styles.MIML}>MIML</div>
                    </div>
                    <div className={styles.MusicIsMyLibrary}>
                        Music<br />Is My<br />Library
                    </div>
                    <CategoryHeader />
                    <div>
                        <input
                            className={styles.searchBox}
                            placeholder=" 제목, 저자, 장르 검색하기"
                            value={searchText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div>
                        {/* <img // 검색 이미지 들어갈 자리 /> */}
                    </div>
                    <div className={styles.iconItem}>
                        <img src={icons.bookmark} onClick= {myBookListClick} alt="bookmark" className={styles.icon} 
                            style={{cursor: 'pointer'}} />
                        <img src={icons.like}  alt="like" className={styles.icon}
                            style={{cursor: 'pointer'}} onClick={likeButtonClick}/>
                            
                        <img src={icons.account}  alt="account" className={styles.icon} 
                            style={{ cursor: 'pointer' }} onClick={myButtonClick} />
                            
                    </div>
                </div>
            </section>
        </>
    );
};

export default Header;
