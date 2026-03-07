import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const OutputContainer = styled.div`
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const ControlsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ControlLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const OptionButton = styled.button`
  cursor: pointer;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 800;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #555;
  flex: 1;
  text-align: center;

  &.selected {
    background-color: #111;
    color: white;
    border-color: #111;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  font-size: 0.9rem;
  color: #555;
  font-weight: 600;
  cursor: pointer;

  input {
    margin-right: 8px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #111;
  }
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

function OutputDisplay({ tweetText, presetType, setPresetType, playerSlots, setPlayerSlots }) {
  const [editableText, setEditableText] = useState(tweetText);
  const [autoRotate, setAutoRotate] = useState(() => {
    const saved = localStorage.getItem('autoRotatePreset');
    return saved === 'true'; // Default is false, checked explicitly against 'true'
  });

  useEffect(() => {
    setEditableText(tweetText);
  }, [tweetText]);

  const handleAutoRotateChange = (e) => {
    const isChecked = e.target.checked;
    setAutoRotate(isChecked);
    localStorage.setItem('autoRotatePreset', isChecked);
  };

  const charCount = editableText.length;

  const rotatePreset = () => {
    if (autoRotate) {
      setPresetType(prev => (prev % 4) + 1);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    rotatePreset();
  };

  return (
    <OutputContainer>
      <ControlsGroup>
        <ControlSection>
          <ControlLabel>레이아웃</ControlLabel>
          <ButtonGroup>
            {[1, 2, 3, 4].map(num => (
              <OptionButton
                key={num}
                className={presetType === num ? 'selected' : ''}
                onClick={() => setPresetType(num)}
              >
                {num}
              </OptionButton>
            ))}
          </ButtonGroup>
        </ControlSection>
        <ControlSection>
          <ControlLabel>@ 모집 인원</ControlLabel>
          <ButtonGroup>
            {[1, 2, 3, 4].map(num => (
              <OptionButton
                key={num}
                className={playerSlots === num ? 'selected' : ''}
                onClick={() => setPlayerSlots(num)}
              >
                {num}
              </OptionButton>
            ))}
          </ButtonGroup>
        </ControlSection>
      </ControlsGroup>
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
          onClick={rotatePreset}
        >
          𝕏에 게시하기
        </TweetButton>
      </ButtonContainer>
      <CheckboxContainer as="label">
        <input
          type="checkbox"
          checked={autoRotate}
          onChange={handleAutoRotateChange}
        />
        복사 및 게시 시마다 레이아웃 변경 (서치밴 방지)
      </CheckboxContainer>
    </OutputContainer>
  );
}

export default OutputDisplay;