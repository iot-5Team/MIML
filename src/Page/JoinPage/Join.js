import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Join = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");

  const [clickedButton, setClickedButton] = useState([]);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [NickNameCheckMessage, setNickNameCheckMessage] = useState("");
  
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [isIdDuplicate, setIsIdDuplicate] = useState(false);
  const [isNickNameDuplicate, setIsNickNameDuplicate] = useState(false);

  const serverIP = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const categories = [
    "인기 도서",
    "신작",
    "남성 인기",
    "여성 인기",
    "판타지",
    "현판",
    "로판",
    "로맨스"
  ];

  const handleJoinClick = () => {
    const userData = {
      userId: userId,
      password: password,
      nickname: nickName,
      userRole: 0,
      email: email,
      thema: clickedButton, 
    };
    console.log(userData);

    axios
      .post(`${serverIP}/addUser`, userData)
      .then((response) => {
        console.log(response.data + "로그인 시도");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  const handleDuplicateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsEmailDuplicate(null);
      setEmailCheckMessage("유효한 이메일을 입력하세요.");
      setIsEmailDuplicate(true);
      setIsButtonEnabled(false);
      return;
    }

    axios
      .post(`${serverIP}/checkEmail`, { email: email })
      .then((res) => {
        const isDuplicate = res.data;
        if (!isDuplicate) {
          setIsEmailDuplicate(false);
          setEmailCheckMessage("사용 할 수 있는 이메일 입니다.");
          setIsButtonEnabled(true);
        } else {
          setIsEmailDuplicate(true);
          setEmailCheckMessage("중복되는 이메일 입니다.");
          setIsButtonEnabled(false);
        }
      })
      .catch((error) => {
        console.error("Error checking duplicate email:", error);
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
        setIsButtonEnabled(false);
      });
  };

  const handleDuplicateId = (userId) => {
    axios
      .post(`${serverIP}/checkId`, { userId: userId })
      .then((res) => {
        const flag = res.data;
        if (!flag) {
          setIsIdDuplicate(false);
          setIdCheckMessage("사용 할 수 있는 아이디 입니다.");
        } else {
          setIsIdDuplicate(true);
          setIdCheckMessage("중복되는 아이디 입니다.");
        }
      })
      .catch((error) => {
        console.error("Error checking duplicate Id:", error);
      });
  };

  const handleDuplicateNickName = () => {
    axios
      .post(`${serverIP}/checkNickName`, { nickname: nickName })
      .then((res) => {
        const flag = res.data;
        if (!flag) {
          setIsNickNameDuplicate(false);
          setNickNameCheckMessage("사용 할 수 있는 닉네임 입니다.");
        } else {
          setIsNickNameDuplicate(true);
          setNickNameCheckMessage("중복되는 닉네임 입니다.");
        }
      })
      .catch((error) => {
        console.error("Error checking duplicate email:", error);
      });
  };

  // Handle category button click
  const handleCategoryClick = (category) => {
    const updatedCategories = clickedButton.includes(category)
      ? clickedButton.filter((c) => c !== category) // Unselect the category if already selected
      : clickedButton.length < 3
      ? [...clickedButton, category] // Add the category if less than 3 are selected
      : clickedButton; // Do nothing if 3 categories are already selected

    setClickedButton(updatedCategories);
    console.log(updatedCategories);
  };

  const isJoinButtonEnabled =
    !isEmailDuplicate && !isIdDuplicate && !isNickNameDuplicate;

  return (
    <div>
      <JoinForm>
        <h2>회원 가입</h2>
        <InputField
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ borderColor: isEmailDuplicate ? "red" : "#ccc" }}
        />
        <CheckButton onClick={() => handleDuplicateEmail(email)}>
          이메일 중복 확인
        </CheckButton>
        {emailCheckMessage && <p>{emailCheckMessage}</p>}

        <InputField2
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ borderColor: isIdDuplicate ? "red" : "#ccc" }}
        />
        <CheckButton onClick={() => handleDuplicateId(userId)}>
          아이디 중복 확인
        </CheckButton>
        {idCheckMessage && <p>{idCheckMessage}</p>}

        <InputField3
          type="text"
          placeholder="닉네임"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          style={{ borderColor: isNickNameDuplicate ? "red" : "#ccc" }}
        />
        <CheckButton onClick={() => handleDuplicateNickName()}>
          닉네임 중복 확인
        </CheckButton>
        {NickNameCheckMessage && <p>{NickNameCheckMessage}</p>}

        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <h3>관심 분야 설정 하기</h3>
        <CategoryBox>
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              onClick={() => handleCategoryClick(category)}
              isClicked={clickedButton.includes(category)}
              disabled={
                clickedButton.length >= 3 && !clickedButton.includes(category)
              }
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryBox>

        <SubmitButton
          onClick={handleJoinClick}
          disabled={!isJoinButtonEnabled}
        >
          가입하기
        </SubmitButton>
      </JoinForm>
    </div>
  );
};

const JoinForm = styled.div`
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 30px;
`;

const InputField = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const InputField2 = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const InputField3 = styled.input`
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #937dc2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const CheckButton = styled.button`
  width: 120px;
  height: 40px;
  background-color: #937dc2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
`;

const CategoryBox = styled.div`
  max-width: 700px;
  margin: 0px auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  justify-items: center
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const CategoryButton = styled.button`
  background-color: ${({ isClicked }) =>
    isClicked ? "#7F6AAA" : "#937DC2"}; // Change background based on selection
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  color: white;
  width: 100%;

  &:hover {
    background-color: #5b477a;
  }

  ${({ isClicked }) =>
    isClicked &&
    `
        background-color: #5B477A;  // Keep hover color if clicked
    `}
`;

export default Join;