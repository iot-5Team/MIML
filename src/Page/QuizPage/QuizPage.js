import React, { useState } from "react";
import QuizPageHeader from "./QuizPageHeader.js";
import { useLocation } from "react-router";
import styled from "styled-components";
import { useTheme } from "../../context/themeProvider.js";

const QuizPage = () => {
  const location = useLocation();
  const bookId = location.state ? location.state.props : null; // bookId 가져오기
  const [themeMode] = useTheme();

  
  // 문제와 보기 데이터
  const questionsBook38 = [
    {
      id: 1,
      question: "이기적인 유전자에서 유전자는 무엇을 의미하나요?",
      options: [
        "생명체의 이기적인 행동을 조종하는 요소",
        "생명체의 생존을 위한 단백질 생성 단위",
        "자신의 복제와 생존을 목적으로 하는 기본 단위",
        "생명체 내에서 협력을 촉진하는 요소",
      ],
      answer: 2,
    },
    {
      id: 2,
      question: "'밈'이란 무엇인가요?",
      options: [
        "문화적 유전자로, 아이디어나 행동을 전파하는 단위",
        "사회적 진화의 방해 요소",
        "유전자의 복제 메커니즘과 유사한 생물학적 과정",
        "유전 정보를 보관하는 DNA 구조",
      ],
      answer: 0,
    },
    {
      id: 3,
      question: "유전자가 협력을 촉진하는 이유는?",
      options: [
        "환경 적응 과정에서 협력 행동이 유리하기 때문",
        "개체의 생존과 번식 성공률을 높이기 위해",
        "유전자가 협력을 통해 자신을 복제하는 데 유리하기 때문",
        "사회적 규범을 준수하기 위해",
      ],
      answer: 2,
    },
    {
      id: 4,
      question: "생존 기계란 무엇인가요?",
      options: [
        "생명체의 신체와 행동을 제어하는 기계적 장치",
        "유전자의 생존과 복제를 돕는 생명체",
        "복잡한 환경에 적응하는 진화적 도구",
        "유전 정보의 전파를 막는 생물학적 장치",
      ],
      answer: 1,
    },
    {
      id: 5,
      question: "다음 중 '유전자 중심 관점'의 특징은?",
      options: [
        "생물학적 진화를 개체의 행동으로 설명",
        "종의 생존이 진화의 최우선 목표라고 주장",
        "개체와 종이 아니라 유전자의 생존과 복제를 중심으로 설명",
        "환경과의 상호작용을 배제하고 유전자만 강조",
      ],
      answer: 2,
    },
  ];
  
  const questionsBook49 = [
    {
      id: 1,
      question: "반짝이는 다람쥐는 왜 별을 보고 반짝이고 싶어했을까요?",
      options: [
        "별처럼 빛나는 것이 멋지다고 생각해서",
        "별들이 자신을 응원하는 것 같아서",
        "다른 동물들에게 특별하게 보이기 위해서",
        "숲속에서 가장 멋진 존재가 되고 싶어서",
      ],
      answer: 0,
    },
    {
      id: 2,
      question: "숲속 친구들은 반짝이가 별처럼 반짝인다고 말했을 때 어떤 반응을 보였나요?",
      options: [
        "모두 신기해하며 반짝이를 칭찬했다",
        "반짝이가 무리한 꿈을 꾸고 있다고 말했다",
        "반짝이가 너무 자랑스럽다고 했다",
        "별처럼 반짝이는 것은 불가능하다고 말했다",
      ],
      answer: 1,
    },
    {
      id: 3,
      question: "반짝이가 별처럼 반짝이기 위해 했던 노력은 무엇인가요?",
      options: [
        "숲속에서 가장 멋진 옷을 입기 위해 준비했다",
        "밤마다 별빛을 따라가며 연습했다",
        "자신만의 빛을 만들기 위해 특별한 기술을 배우려 했다",
        "자신의 꿈을 이루기 위해 왕관을 만들었다",
      ],
      answer: 2,
    },
    {
      id: 4,
      question: "반짝이가 만든 왕관에 대한 친구들의 반응은 어땠나요?",
      options: [
        "친구들이 너무 멋지다고 칭찬했다",
        "친구들은 왕관이 별처럼 반짝인다고 감탄했다",
        "왕관이 너무 특별해 보인다고 생각했다",
        "친구들은 왕관을 볼 때 웃으며 반응했다",
      ],
      answer: 1,
    },
    {
      id: 5,
      question: "반짝이는 꿈을 이루는 과정에서 무엇을 배웠고, 숲속 친구들에게 어떤 메시지를 전했나요?",
      options: [
        "자신의 꿈을 믿고 꾸준히 노력하면 결국 이루어진다는 것을 배웠다",
        "꿈은 나만의 것이기 때문에 다른 사람을 배려해야 한다는 것을 배웠다",
        "나의 꿈이 중요하지만 다른 사람들의 의견도 존중해야 한다는 것을 배웠다",
        "꿈은 이루어지는 것이 아니라 포기해야 한다는 것을 배웠다",
      ],
      answer: 0,
    },
  ];
  
  const questions = bookId === 38 ? questionsBook38 : bookId === 49 ? questionsBook49 : [];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0); // 정답 횟수
  const [wrongAnswers, setWrongAnswers] = useState(0); // 오답 횟수

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    const correct = index === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  return (
    <>
      <QuizPageHeader bookId={bookId} />
      <TotalBox>
        <ReadBox theme={themeMode}>
          <ImgStyle src={`/BookImg/${bookId}.png`} />
        </ReadBox>
        <ReadBox1 theme={themeMode}>
          <QnaStyle src="/QnA/QnA.png" />
          <ProgressText theme={themeMode}>
            {`현재 ${currentQuestionIndex + 1}번 문제, 총 ${questions.length}문제 중 ${questions.length - (currentQuestionIndex + 1)}문제 남음`}
          </ProgressText>
          <QnaText theme={themeMode}>
            <div>Q. {currentQuestion.question}</div>
            {currentQuestion.options.map((option, index) => (
              <OptionButton
                key={index}
                theme={themeMode}
                onClick={() => handleAnswerSelect(index)}
                selected={selectedAnswer === index}
              >
                {option}
              </OptionButton>
            ))}
            {selectedAnswer !== null && (
              <ResultText theme={themeMode}>
                {isCorrect ? "정답입니다!" : `틀렸습니다! 정답: ${currentQuestion.options[currentQuestion.answer]}`}
              </ResultText>
            )}
            {selectedAnswer !== null && currentQuestionIndex < questions.length - 1 && (
              <NextButton theme={themeMode} onClick={handleNextQuestion}>
                다음 문제
              </NextButton>
            )}
            {currentQuestionIndex === questions.length - 1 && selectedAnswer !== null && (
              <ResultText theme={themeMode}>
                퀴즈 완료! <br />
                정답: {score}개, 오답: {wrongAnswers}개
              </ResultText>
            )}
          </QnaText>
        </ReadBox1>
      </TotalBox>
    </>
  );
};

export default QuizPage;

const TotalBox = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const ReadBox = styled.div`
  width: 565px;
  height: 700px;
  background-color: ${(props) => (props.theme === "light" ? "#antiquewhite" : "#030314")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgStyle = styled.img`
  width: 100%;
  height: 100%;
`;

const ReadBox1 = styled.div`
  width: 600px;
  height: 700px;
  background-color: ${(props) => (props.theme === "light" ? "#antiquewhite" : "#030314")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  position: relative;
`;

const QnaStyle = styled.img`
  width: 600px;
  height: 700px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const QnaText = styled.div`
  width: 100%;
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
`;

const ProgressText = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
`;

const OptionButton = styled.button`
  padding: 10px 20px;
  margin: 1px 30px ;
  background-color: ${(props) => (props.selected ? "#D3D3D3" : "#FFFFFF")};
  border: 1px solid ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
//   color: ${(props) => (props.theme === "light" ? "#000000" : "#ffffff")};
  cursor: pointer;
`;

const ResultText = styled.div`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const NextButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;
