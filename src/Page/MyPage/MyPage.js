import Header from '../../components/layout/Header/Header.js';
import Footer from '../../components/layout/Footer/Footer.js';
import styles from './MyPage.module.css';
import userImage from "../../assets/user/user1.png";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MyPage = () => {
    const serverIp = process.env.REACT_APP_SERVER_URL;
    const [userInfo, setUserInfo] = useState(null);
    const [userId, setUserId] = useState("");
    const [bookIds, setBookIds] = useState([]);
    const navigate = useNavigate();

    const logoutButtonClick = () => {
        localStorage.removeItem("token");
        navigate('/')
    }

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
            console.log(token);
            try {
                const response = await axios.get(`${serverIp}/user-info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(response.data);
                console.log(response.data);
                setUserId(response.data.userId);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [serverIp]);

    useEffect(() => {
        if (userId) {
            axios.get(`${serverIp}/book/recent/${userId}`)
                .then((res) => {
                    console.log(res.data);
                    setBookIds(res.data.map(book => book.bookId)); // Assuming the response has an array of books with bookId
                    console.log(bookIds+"책 아이디요요요");
                })
                .catch((err) => {
                    console.error("Error fetching recent books:", err);
                });
        }
    }, [userId, serverIp]);

    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.body}>
                <img className={styles.userImage}
                    loading="lazy"
                    alt="유저 이미지"
                    src={userImage}
                />

                <div className={styles.userName}>
                    &nbsp;&nbsp;{userInfo && userInfo.nickname}
                </div>
                <div className={styles.userSetting}>
                    {/* 프로필 편집 기능 추가 */}
                    <button className={styles.profileButton} onClick={logoutButtonClick}>
                        프로필 편집
                    </button>
                    {/* 로그아웃 기능 추가 */}
                    <button className={styles.profileButton} onClick={logoutButtonClick}>
                        로그아웃
                    </button>
                </div>
            </div>

            <br /><br />
            <h2>최근 본 도서</h2><br />
            <div className={styles.divBox}>
                {bookIds.slice(0, 4).map((bookId, index) => (
                    <div key={index} className={styles.div}>
                        <img style={{width:"200px",height:"300px"}} src={`/BookImg/${bookId}.png`} alt="Book Cover" className={styles.bookImg} />
                    </div>
                ))}
            </div>

            <br /><br />
            <h2>통계</h2>
            월간 연간 누적
            <div className={styles.monthBox}>
                <div className={styles.otherMonth}> 4 </div>
                <div className={styles.month}> 5 </div>
                <div className={styles.otherMonth}> 6 </div>
            </div>

            <br /><br /><br />
            <div className={styles.recordBox}>
                <div className={styles.recordBoxIn}>
                    내가 읽은 책
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            7
                        </div>
                        <div className={styles.recordBoxIn3}>
                            권
                        </div>
                    </div>
                </div>
                <div className={styles.recordBoxIn}>
                    총 독서량
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            12.4
                        </div>
                        <div className={styles.recordBoxIn3}>
                            시간
                        </div>
                    </div>
                </div>
                <div className={styles.recordBoxIn}>
                    일일 독서량
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            38
                        </div>
                        <div className={styles.recordBoxIn3}>
                            분
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.recordBox}>
                <div className={styles.recordBoxIn}>
                    종합 집중도
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            82
                        </div>
                        <div className={styles.recordBoxIn3}>
                            /100
                        </div>
                    </div>
                </div>
                <div className={styles.recordBoxIn}>
                    독서 속도
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            280
                        </div>
                        <div className={styles.recordBoxIn3}>
                            /분
                        </div>
                    </div>
                </div>
                <div className={styles.recordBoxIn}>
                    눈 깜빡임
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            14
                        </div>
                        <div className={styles.recordBoxIn3}>
                            /분
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.recordBox}>
                <div className={styles.recordBoxIn}>
                    선호하는 장르
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            판타지
                        </div>
                        <div className={styles.recordBoxIn3}>
                            물
                        </div>
                    </div>
                </div>
                <div className={styles.recordBoxIn}>
                    독서한 날
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            5
                        </div>
                        <div className={styles.recordBoxIn3}>
                            /주
                        </div>
                    </div>
                </div>
                <div className={styles.recordBoxIn}>
                    최장 독서량
                    <div className={styles.recordBoxContainer}>
                        <div className={styles.recordBoxIn2}>
                            1.6
                        </div>
                        <div className={styles.recordBoxIn3}>
                            시간
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.margin}></div>
            <div className={styles.settingBox}>
                내 정보
            </div>
            <div className={styles.settingIn}>
                나의 문의<br />
                나의 후기<br />
                설정<br />
                로그아웃
            </div>
            <div className={styles.settingBox}>
                고객센터
            </div>
            <div className={styles.settingIn}>
                문의사항<br />
                공지사항<br />
            </div>
            <Footer />
        </div>
    )
}

export default MyPage;
