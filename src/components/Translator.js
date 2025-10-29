import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import ReactMarkdown from 'react-markdown';

// --- Styled Components ---

const DraggableWindow = styled.div`
  position: fixed;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e5e5;
  z-index: 1000;
  width: 90%;
  max-width: 500px;

  @media (max-width: 640px) {
    left: 50% !important;
    top: 100px !important;
    transform: translateX(-50%);
  }
`;

const Header = styled.div`
  padding: 10px 20px;
  cursor: move;
  background-color: #f7f7f7;
  border-bottom: 1px solid #eee;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
    padding: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #111;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: #888;
    font-size: 1.8rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: color 0.2s ease;

    &:hover {
        color: #111;
    }
`;

const inputStyles = css`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f7f7f7;
  transition: border-color 0.2s ease;
  color: #111;

  &:focus {
    outline: none;
    border-color: #111;
  }
`;

const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 100px;
  resize: vertical;
  margin-bottom: 10px;
`;

const OutputDisplay = styled.div`
  ${inputStyles}
  min-height: 100px;
  overflow: auto;
  margin-bottom: 10px;

  ${props => props.$isError && css`
    color: #e53e3e;
  `}

  p:first-child, pre:first-child { margin-top: 0; }
  p:last-child, pre:last-child { margin-bottom: 0; }
`;

const Input = styled.input`
    ${inputStyles}
    margin-bottom: 10px;
`;

const ApiKeyLink = styled.a`
    display: block;
    margin-top: -5px;
    margin-bottom: 10px;
    font-size: 0.8rem;
    color: #555;
    text-align: right;
    text-decoration: none;

    &:hover {
        color: #111;
    }
`;

const ActionButton = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    background-color: #111;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #333;
    }

    &:disabled {
        background-color: #a0aec0;
        cursor: not-allowed;
    }
`;

const ToggleGroup = styled.div`
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
`;

const ToggleButton = styled.button`
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    background-color: #fff;
    color: #555;
    transition: all 0.2s ease;

    &.active {
        background-color: #111;
        color: white;
        border-color: #111;
    }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 10px;
  color: #555;

  input {
      margin-right: 8px;
      accent-color: #111;
  }
`;

// --- Helper Functions ---

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// --- Component ---

function Translator({ setIsOpen }) {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [direction, setDirection] = useState('ko-ja'); // 'ko-ja' or 'ja-ko'
    const [useFlash, setUseFlash] = useState(false);

    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 250, y: 100 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const windowRef = useRef(null);

    useEffect(() => {
        const savedApiKey = getCookie('geminiApiKey');
        if (savedApiKey) {
            setApiKey(savedApiKey);
        }
    }, []);

    const handleMouseDown = (e) => {
        if (window.innerWidth < 640) return;
        if (!windowRef.current) return;
        isDragging.current = true;
        const rect = windowRef.current.getBoundingClientRect();
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [offset]);

    const handleTranslate = async () => {
        if (!inputText || !apiKey) {
            setIsError(true);
            setOutputText('API 키와 번역할 텍스트를 모두 입력해주세요.');
            return;
        }
        
        setIsLoading(true);
        setIsError(false);
        setCookie('geminiApiKey', apiKey, 365);

        const model = useFlash ? 'gemini-flash-latest' : 'gemini-flash-lite-latest';
        const [sourceLang, targetLang] = direction.split('-');
        const sourceLangName = sourceLang === 'ko' ? 'Korean' : 'Japanese';
        const targetLangName = targetLang === 'ja' ? 'Japanese' : 'Korean';

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const prompt = `Translate from ${sourceLangName} to ${targetLangName} and only output the translated result: ${inputText}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            });

            if (!response.ok) throw new Error(`API 요청 실패: ${response.statusText}`);
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                const result = data.candidates[0].content.parts[0].text;
                setOutputText(result);
            } else {
                throw new Error(data.error ? data.error.message : 'API로부터 유효한 응답을 받지 못했습니다.');
            }
        } catch (error) {
            console.error('Gemini Translation error:', error);
            setIsError(true);
            setOutputText(`번역 오류: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DraggableWindow ref={windowRef} style={{ top: `${position.y}px`, left: `${position.x}px` }}>
            <Header onMouseDown={handleMouseDown}>
                <Title>번역기</Title>
                <CloseButton onClick={() => setIsOpen(false)}>×</CloseButton>
            </Header>
            <Content>
                <ToggleGroup>
                    <ToggleButton className={direction === 'ko-ja' ? 'active' : ''} onClick={() => setDirection('ko-ja')}>한 → 일</ToggleButton>
                    <ToggleButton className={direction === 'ja-ko' ? 'active' : ''} onClick={() => setDirection('ja-ko')}>일 → 한</ToggleButton>
                </ToggleGroup>
                <TextArea 
                    placeholder={direction === 'ko-ja' ? "한국어 텍스트 입력..." : "일본어 텍스트 입력..."}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <OutputDisplay $isError={isError}>
                    {outputText ? (
                        <ReactMarkdown>{outputText}</ReactMarkdown>
                    ) : (
                        <span style={{ color: '#999' }}>
                            {direction === 'ko-ja' ? "일본어 번역 결과..." : "한국어 번역 결과..."}
                        </span>
                    )}
                </OutputDisplay>
                <CheckboxLabel>
                    <input type="checkbox" checked={useFlash} onChange={(e) => setUseFlash(e.target.checked)} />
                    gemini-flash-lite 대신 gemini-flash 사용
                </CheckboxLabel>
                <Input 
                    type="password" 
                    placeholder="Gemini API 키 입력 (필수)..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <ApiKeyLink href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer">
                    Gemini API 키 발급받기
                </ApiKeyLink>
                <div>
                    <ActionButton onClick={handleTranslate} disabled={isLoading}>
                        {isLoading ? '번역 중...' : '번역하기'}
                    </ActionButton>
                </div>
            </Content>
        </DraggableWindow>
    );
}

export default Translator;