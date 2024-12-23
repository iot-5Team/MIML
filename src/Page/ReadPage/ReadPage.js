import React, { useEffect, useState } from "react";
import Header from '../../components/layout/Header/Header.js';
import ReadPageHeader from './ReadPageHeader.js';
import soonsin from "../../assets/AiImage/soonsin.png";
import styled, {ThemeProvider} from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router";
import replace from "../../assets/AiImage/zero.png"; // Updated import path
import { useTheme } from '../../context/themeProvider.js';

const ReadPage = () => {
    const [bookText, setBookText] = useState("");
    
    const [isOn, setIsOn] = useState(false);
    const [bookText2, setBookText2] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [musicUrl, setMusicUrl] = useState("");
    const [imageError, setImageError] = useState(false);
    const location = useLocation();
    const [userId, setUserId] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [nickname,setNickname] = useState("");

    const bookId = location.state ? location.state.props : null;
    const bookTitle = location.state ? location.state.title : null;
    const lastPage = location.state ? location.state.lastpage : 0;
    const userPage = location.state ? location.state.userpage : 0;
    const thema = location.state ? location.state.thema : null;
    console.log(userPage+"책 저장 된거 값"+lastPage);
    // console.log(bookId+"가져온것");
    console.log(lastPage+"책 페이지 가져온것");
    const [bookPage, setBookPage] = useState(userPage);
    const serverIP = process.env.REACT_APP_SERVER_URL;
    const FlaskServerIp = process.env.REACT_APP_FLASK_URL;
    const [themeMode] = useTheme(); 
    
    useEffect(() => {
        // console.log(props.theme)
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${serverIP}/user-info`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(response.data);
                setUserId(response.data.userId);
                setNickname(response.data.nickname);
               

                const recentData = {
                    "bookId": bookId,
                    "userId": response.data.userId // 응답에서 userId 사용
                };
                const saveViewData = {
                    "bookId": bookId,
                    "title":bookTitle,
                    "thema":thema,
                    "cnt": 0
                };

                console.log("최근 데이터:", {recentData,saveViewData});
                axios.post(`${serverIP}/book/save/recent`, {recentData,saveViewData})
                    .then((res) => {
                        console.log("최근 데이터 저장 완료:", res);
                    })
                    .catch((err) => {
                        console.error("Error saving recent data:", err);
                    });

            } catch (error) {
                console.error("Error fetching user info:", error);
                // 에러 처리 (예: 로그인 페이지로 리다이렉트)
            }
        };
        

        fetchUserInfo();

        axios.get(`${serverIP}/book/text/${bookId}/${bookPage}`)
            .then((res) => {
                setBookText(res.data);
            })
            .catch((error) => {
                console.error('Error fetching book text:', error);
            });

        if (isOn) {
            axios.get(`${serverIP}/book/text/${bookId}/${bookPage + 1}`)
                .then((res) => {
                    console.log(res);
                    setBookText2(res.data);
                })
                .catch((error) => {
                    console.error('Error fetching book text 2:', error);
                });
        } else {
            axios.get(`${serverIP}/img/${bookId}/page/${bookPage}`)
                .then((res) => {
                    console.log(res);
                    if (res.data.image) {
                        setImageUrl(`data:image/png;base64,${res.data.image}`);
                    } else {
                        setImageError(true);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching image121121:', error);
                    setImageError(true);
                });
        }

        if (bookId >= 37) {
            const data = {
                "bookid": bookId,
                "page": bookPage,
            };
            const config = {"Content-Type": 'application/json'};
            axios.post(`${FlaskServerIp}/process-event/`, data, config)
                .then((req) => {
                    console.log("결과 테스트 중 이미지 ,음악",req);
                    // console.log(req.data);
                    const base64Image = req.data.image;
                    const base64String = req.data.music;

                    const musicBlob = base64ToBlob(base64String, 'audio/mpeg');
                    const newMusicUrl = URL.createObjectURL(musicBlob);
                    setMusicUrl(prevUrl => {
                        if (prevUrl) {
                            URL.revokeObjectURL(prevUrl);
                        }
                        return newMusicUrl;
                    });

                    if (base64Image) {
                        const imageBlob = base64ToBlob(base64Image, 'image/png');
                        const newImageUrl = URL.createObjectURL(imageBlob);
                        setImageUrl(newImageUrl);
                    }
                })
                .catch((err) => {
                    console.error('Error posting data to Flask server:', err);
                });
        }
    }, [bookPage, isOn, bookId, FlaskServerIp, serverIP]);

    const base64ToBlob = (base64, type) => {
        const binary = atob(base64);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type });
    };

    const onErrorImg = (e) => {
        e.target.src = replace;
        setImageError(true);
    };
    const handleQnAButton = (bookid) => {
        // ai 서버로 해당 bookid 를 보내고 -> ai 서버에서 스프링으로 요청 -> 데이터 전송 -> 결과 값 리액트로 전송 -> 끝
        //http://localhost:8080/book/text/49 책 내용 전부 가져오는 api
        // fetch(`http://localhost:8080/book/text/${bookid}`,{
        //     method: 
        // })
    }

    const handlePreviousPage = () => {
        const bookMark = {
            bookid: bookId,
            nickname : nickname,
            page : bookPage

        }
        //책 빼는거 마이너스 더 들어가야됨
        setBookPage(prevPage => Math.max(prevPage - 1, 1)); // 페이지 번호가 1 이하로 내려가지 않도록 방지

        axios.post(`${serverIP}/book/bookmark/${lastPage}/${bookId}`, bookMark)
        .then((res) => {
            console.log("저장됐을 거임:", res);
        })
        .catch((err) => {
            console.error("북마크 오류:", err);
        });
    };

    const handleNextPage = () => {
        setBookPage(prevPage => isOn ? prevPage + 2 : prevPage + 1);
        const bookMark = {
            bookid: bookId,
            nickname : nickname,
            page : bookPage

        }
        console.log(bookPage,bookId+"책 api 보내는 정보 확인 ")
        axios.post(`${serverIP}/book/bookmark/${lastPage}/${bookId}`, bookMark)
        .then((res) => {
            console.log("저장됐을 거임:", res);
        })
        .catch((err) => {
            console.error("북마크 오류:", err);
        });
       
    };

    const toggleTextOnly = (value) => {
        setIsOn(value);
    };

    const handleMusicEnded = () => {
        const audioElement = document.getElementById("background-audio");
        if (audioElement) {
            audioElement.play();
        }
    };

    return (
        <div>
            <ReadPageHeader onToggle={toggleTextOnly} bookId={bookId} />
            <TotalBox>
                <ReadBox theme={themeMode} onClick={handlePreviousPage}>
                    {bookText && bookText.bookwrite && <span>{bookText.bookwrite}</span>}
                    <PageNumberBox1> 
                        <span>{bookPage}P</span>
                    </PageNumberBox1>
                </ReadBox>
                <ReadBox1 theme={themeMode} onClick={handleNextPage}>
                {isOn
                    ? (bookText2 && bookText2.bookwrite && (
                        <>
                            <span>{bookText2.bookwrite}</span>
                            <PageNumberBox1>
                            <span>{bookPage+1}P</span>
                            </PageNumberBox1>
                        </>
                        ))
                    : (
                        !imageError
                            ? <span>이미지를 불러올 수 없습니다.</span>
                            : <img src={imageUrl}
                                alt="책 이미지"
                                onError={onErrorImg}
                                style={{ display: 'block', height: '700px', width: '600px', position: 'relative', left: '-20px', top: '-20px'}}
                            />
                        )
                    }
                </ReadBox1>
            </TotalBox>
                    
            <PageNumberBox1>
            {!isOn && musicUrl && (
                    <audio
                        id="background-audio"
                        src={musicUrl}
                        controls
                        autoPlay
                        onEnded={handleMusicEnded}
                    />
                )}
                
            </PageNumberBox1>
            <div style={{ height: '30px' }}></div>
        </div>
    );
};

const ReadBox = styled.button`
    position: relative; 
    width: 600px;
    height: 700px;
    font-size: 18px;
    line-height: 40px;
    padding: 20px;
    background-color:  ${props => props.theme === 'light' ? '#antiquewhite' : '#030314'};
    color:  ${props => props.theme === 'light' ? '#000000' : '#ffffff'};
    border: 0px;
`;

const ReadBox1 = styled.button`
    position: relative; 
    width: 600px;
    height: 700px;
    border: 0px;
    font-size: 18px;
    line-height: 40px;
    padding: 20px;
    background-color:  ${props => props.theme === 'light' ? '#antiquewhite' : '#030314'};
    color:  ${props => props.theme === 'light' ? '#000000' : '#ffffff'};
`;

const TotalBox = styled.div`
    display: flex;
    margin-top: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 15px;
`;

const PageNumberBox1 = styled.div`
    display: flex;
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    bottom: 0;
    left: 0;
`;

export default ReadPage;
