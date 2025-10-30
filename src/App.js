import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PostGenerator from './components/PostGenerator';
import OutputDisplay from './components/OutputDisplay';
import Translator from './components/Translator';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 25px auto;
  padding: 0 10px;
`;

const Header = styled.div`
    position: relative;
    text-align: center;
    margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #111;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
`;

const TranslatorButton = styled.button`
    background-color: #ffffff;
    color: #333;
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);

    &:hover {
        background-color: #f9f9f9;
        border-color: #ccc;
    }

    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    @media (max-width: 640px) {
        position: static;
        transform: none;
        margin-top: 15px;
    }
`;

function App() {
  const [tweetText, setTweetText] = useState('');
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  return (
    <AppContainer>
        <Header>
            <Title>프세카 주회글 작성기</Title>
            <TranslatorButton onClick={() => setIsTranslatorOpen(true)}>번역기</TranslatorButton>
        </Header>
      <PostGenerator setTweetText={setTweetText} />
      <OutputDisplay tweetText={tweetText} />
      {isTranslatorOpen && <Translator setIsOpen={setIsTranslatorOpen} />}
    </AppContainer>
  );
}

export default App;