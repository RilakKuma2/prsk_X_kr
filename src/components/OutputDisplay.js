import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const OutputContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  resize: vertical;
  background: #f7f7f7;
  word-break: break-all;
  box-sizing: border-box;
  color: #111;
  transition: border-color 0.2s ease;
  font-weight: 700; /* Bolder text */

  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const CharCount = styled.p`
  text-align: right;
  margin-top: 10px;
  font-weight: 700;
  color: ${props => (props.count > 140 ? '#e53e3e' : '#555')};
`;

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
    color: #888;
    cursor: not-allowed;
  }
`;

const CopyButton = styled(Button)`
  background-color: transparent;
  color: #555;
  border-color: #ccc;

  &:hover:not(:disabled) {
    background-color: #f7f7f7;
    color: #111;
    border-color: #aaa;
  }
`;

const TweetButton = styled.a`
  display: block;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  background-color: #000;
  color: white;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333;
  }
`;

function OutputDisplay({ tweetText }) {
  const [editableText, setEditableText] = useState(tweetText);

  useEffect(() => {
    setEditableText(tweetText);
  }, [tweetText]);

  const charCount = editableText.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
  };

  return (
    <OutputContainer>
      <TextArea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
      />
      <CharCount count={charCount}>{charCount} / 140 글자</CharCount>
      <ButtonContainer>
        <CopyButton onClick={handleCopy} disabled={charCount === 0 || charCount > 140}>
          복사
        </CopyButton>
        <TweetButton
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(editableText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          𝕏에 게시하기
        </TweetButton>
      </ButtonContainer>
    </OutputContainer>
  );
}

export default OutputDisplay;