import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../assets/icons/MIML.jpeg";

const Login = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const serverIP = process.env.REACT_APP_SERVER_URL;

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        const loginData = {
            userId: userName,
            password: userPassword
        };

        axios.post(`${serverIP}/login`, loginData)
            .then((response) => {
                if (response.status === 200) {
                    const token = response.data;
                    localStorage.setItem('token', token);  // 토큰 저장
                    navigate("/main");
                } else {
                    alert("아이디 또는 비밀번호가 잘못 되었습니다.");
                }
            })
            .catch((error) => {
                console.error('Login error:', error);
                if (error.response && error.response.status === 401) {
                    alert("아이디 또는 비밀번호가 잘못 되었습니다.");
                } else {
                    alert("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
                }
            });
    };

    const JoinNaviget = () => {
        navigate('/join');
    };

    return (
        <div>
            <MainBox>
                <img src={Logo} style={{width:"100px", height:"100px"}} alt="MIML Logo" />
                <div style={{height:"30px"}}></div>
                <LoginBox>
                    <h2 style={{color:"#937DC2"}}>Login</h2>
                    <form onSubmit={handleLoginSubmit} id="login-form">
                        <InputField
                            type="text"
                            name="userName"
                            placeholder="Id"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <InputField
                            type="password"
                            name="userPassword"
                            placeholder="Password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                        />
                        <SubmitButton type="submit" value="Login" />
                    </form>
                    <div style={{height:'5px'}}></div>
                    <form onSubmit={JoinNaviget} id="join-form">
                        <JoinButton type="submit">회원가입</JoinButton>
                    </form>
                </LoginBox>
            </MainBox>
        </div>
    );
};

const MainBox = styled.div`
  padding: 0;
  margin: 0;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
`;

const LoginBox = styled.div`
  width: 400px;
  height: 350px;
  padding: 40px;
  box-sizing: border-box;
  border: 1px solid #937DC2;
  border-radius:6px;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
`;

const InputField = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 10px;
  box-sizing: border-box;
  margin-bottom: 16px;
  border-radius: 6px;
  background-color: #F8F8F8;
  border : 0px;
`;

const SubmitButton = styled.input`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 6px;
  background-color:#937DC2;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

const JoinButton = styled.button`
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 6px;
    background-color:#937DC2;
    color: white;
    font-size: 16px;
    cursor: pointer;
`;

export default Login;
