import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './TestVocabulary.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import getData from '~/data/vocabularySource';
import randomSort from '~/utils/shuffle';
import routes from '~/config/routes';
import { Spinner } from 'reactstrap';

const cx = classNames.bind(styles);

function TestVocabulary() {
    const voices = window.speechSynthesis.getVoices();

    const savedAppState = JSON.parse(localStorage.getItem('testVocaState'));
    let listSuccess = JSON.parse(localStorage.getItem('listSuccess'));
    if (typeof listSuccess !== 'object' || !listSuccess) {
        listSuccess = [];
    }

    const [words, setWords] = useState(null);
    const [inpVal, setInpVal] = useState(savedAppState?.inpVal || '');
    const [numberOfWrong, setNumberOfWrong] = useState(savedAppState?.numberOfWrong || 0);
    const [answers, setAnswers] = useState(savedAppState?.answers || []);
    const [pass, setPass] = useState(savedAppState?.pass !== undefined ? savedAppState?.pass : null);
    const [complete, setComplete] = useState(savedAppState?.complete || false);

    const [everFalse, setEverFalse] = useState(savedAppState?.everFalse || false);
    const [numberOfAgain, setNumberOfAgain] = useState(savedAppState?.numberOfAgain || 5);

    const inpRef = useRef(null);
    const wrapperRef = useRef(null);

    const [indexQuestion, setIndexQuestion] = useState(savedAppState?.indexQuestion || 0);

    const [voice, setVoice] = useState(
        savedAppState?.voiceName !== undefined ? voices.find((v) => v.name === savedAppState?.voiceName) : voices[0],
    );
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(savedAppState?.utterance || null);

    let { id } = useParams();
    const currWords = useMemo(() => {
        let objChoosen = {};
        if (words !== null) {
            if (id === 'all') {
                words.forEach((item) => {
                    objChoosen = {
                        ...objChoosen,
                        ...item,
                    };
                });
            } else {
                objChoosen = words[id];
            }
        }
        return objChoosen;
    }, [words]);
    let listEnWords = useMemo(() => {
        const list = Object.keys(currWords);
        return list.sort(randomSort);
    }, [currWords]);
    if (savedAppState?.start === true && savedAppState?.listEnWords.length !== 0) {
        listEnWords = savedAppState.listEnWords;
    }

    const handlePlay = () => {
        const synth = window.speechSynthesis;

        if (isPaused) {
            synth.resume();
        } else {
            utterance.voice = voice;
            synth.speak(utterance);
        }

        setIsPaused(false);
    };
    const handleVoiceChange = (event) => {
        setVoice(voices.find((v) => v.name === event.target.value));
    };

    const handleSubmit = () => {
        setAnswers((prev) => [...prev, inpVal]);
        if (inpVal.toLowerCase().trim() !== listEnWords[indexQuestion].toLowerCase()) {
            setNumberOfWrong((prev) => {
                inpRef.current.classList.add(`${cx('wrong')}`);
                prev += 1;
                if (prev === 3) {
                    setEverFalse(true);
                    setNumberOfAgain(5);
                    setPass(false);
                }
                return prev;
            });
        } else {
            if (!everFalse || numberOfAgain === 1) {
                if (indexQuestion === listEnWords.length - 1) {
                    setComplete(true);
                    if (!listSuccess.includes(parseInt(id))) listSuccess.push(parseInt(id));
                    localStorage.setItem('listSuccess', JSON.stringify(listSuccess));
                }
                setPass(true);
                setEverFalse(false);
                setNumberOfAgain(5);
            } else {
                setInpVal('');
                setNumberOfWrong(0);
                setNumberOfAgain((prev) => prev - 1);
            }
        }
    };

    const reset = () => {
        setPass(null);
        setNumberOfWrong(0);
        setAnswers([]);
        setInpVal('');
    };

    const handleNext = () => {
        setIndexQuestion((prev) => prev + 1);
        reset();
    };

    const handleAgain = () => {
        reset();
    };

    const handleChange = (e) => {
        setInpVal(e.target.value);
        if (e.target.classList.remove(`${cx('wrong')}`)) {
            e.target.classList.remove(`${cx('wrong')}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

    const handleCopy = (event) => {
        event.preventDefault();
    };

    const handlePaste = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        if (!listEnWords) return;
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(listEnWords[indexQuestion]);
        // const voices = synth.getVoices();

        setVoice(voice);
        setUtterance(u);

        return () => {
            synth.cancel();
        };
    }, [listEnWords[indexQuestion]]);

    useEffect(() => {
        const getVocabulary = async () => {
            const data = await getData();
            setWords(data);
        };
        getVocabulary();
    }, []);

    useEffect(() => {
        if (inpRef.current) inpRef.current.focus();
    });

    useEffect(() => {
        const payload = {
            inpVal,
            numberOfWrong,
            answers,
            pass,
            complete,
            indexQuestion,
            voiceName: voice?.name,
            listEnWords,
            utterance,
            everFalse,
            numberOfAgain,
            start: true,
        };
        localStorage.setItem('testVocaState', JSON.stringify(payload));
        localStorage.setItem('listSuccess', JSON.stringify(listSuccess));
    });

    const handleKeyDownNotice = (e) => {
        console.log(e);
        if (e.key === 'Enter') {
            if (pass !== null) {
                if (pass === true) {
                    if (indexQuestion !== listEnWords.length - 1) {
                        handleNext();
                    }
                } else {
                    handleAgain();
                }
            }
        }
        if (e.key === 'Control' || e.key === 'Ctrl') {
            if (pass === true) {
                handlePlay();
            }
        }
    };

    useEffect(() => {
        console.log(wrapperRef.current);
        if (pass !== null) wrapperRef.current.focus();
    }, [pass]);

    // useEffect(() => {
    //     window.addEventListener('keydown', handleKeyDownNotice);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDownNotice);
    //     };
    // }, []);
    return (
        <div ref={wrapperRef} tabIndex={-1} onKeyDown={(e) => handleKeyDownNotice(e)} className={cx('wrapper')}>
            {!!words && (
                <>
                    <span className={cx('lbl-warning')}>Mỗi câu hỏi bạn được phép trả lời tối đa 3 lần</span>
                    <span className={cx('lbl-notice')}>
                        Bạn còn <span className={cx('cnt')}>{3 - numberOfWrong}</span> lần thử
                    </span>
                    {everFalse && (
                        <span className={cx('lbl-notice')}>
                            Bạn phải nhập đúng từ này{' '}
                            <span className={cx('cnt')} style={{ color: 'red' }}>
                                {numberOfAgain}
                            </span>{' '}
                            lần thì mới qua được câu hỏi tiếp theo
                        </span>
                    )}
                    <div className={cx('container', 'container-question')}>
                        {pass && (
                            <FontAwesomeIcon
                                className={cx('icon-speaker-small')}
                                icon={faVolumeHigh}
                                onClick={handlePlay}
                            />
                        )}
                        <div className={cx('info')}>
                            <div className="row">
                                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-lg-start justify-content-center mb-2 mb-lg-0">
                                    <span className={cx('label-text')}>
                                        Question {indexQuestion + 1} / {listEnWords.length}
                                    </span>
                                </div>
                                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-lg-end justify-content-center">
                                    <label className={cx('choose-voice')}>
                                        <span>Voice: </span>
                                        <select
                                            className={cx('select-speaker')}
                                            value={voice?.name}
                                            onChange={handleVoiceChange}
                                        >
                                            {window.speechSynthesis.getVoices().map((voice) => (
                                                <option key={voice.name} value={voice.name}>
                                                    {voice.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {pass === null && (
                            <>
                                <span className={cx('questions')}>{currWords[listEnWords[indexQuestion]]}</span>
                                <input
                                    ref={inpRef}
                                    value={inpVal}
                                    type="text"
                                    className={cx('inp-ans')}
                                    placeholder="Enter your answer..."
                                    onCopy={handleCopy}
                                    onPaste={handlePaste}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                />
                                <button className={cx('btn')} onClick={handleSubmit}>
                                    Submit
                                </button>
                            </>
                        )}
                        {pass !== null && (
                            <div
                                // ref={wrapperRef}
                                className={'notice-container'}
                                // tabIndex={-1}
                                // onKeyDown={(e) => handleKeyDownNotice(e)}
                            >
                                <h1
                                    className={cx('notice-lbl', {
                                        pass,
                                        'not-pass': pass === false,
                                    })}
                                >
                                    {complete ? 'HOÀN THÀNH' : pass ? 'THÀNH CÔNG' : 'THẤT BẠI'}
                                </h1>
                                <h1 className={cx('true-ans')}>{listEnWords[indexQuestion].toLowerCase()}</h1>
                                {pass === false && (
                                    <ul className={cx('list-anss')}>
                                        {answers.map((text, index) => (
                                            <li key={index}>
                                                <b>Lần {index + 1}:</b> {text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {pass && (
                                    <div className={cx('list-btn-ans', 'd-flex')}>
                                        <Link to={`/translate/${listEnWords[indexQuestion]}`} className={cx('btn')}>
                                            View Detail
                                        </Link>
                                    </div>
                                )}
                                <div className={cx('list-btns')}>
                                    <Link to={routes.home} className={cx('btn')}>
                                        Về trang chủ
                                    </Link>
                                    {!complete && pass && (
                                        <button className={cx('btn')} onClick={handleNext}>
                                            Câu tiếp theo
                                        </button>
                                    )}
                                    {pass === false && (
                                        <button className={cx('btn')} onClick={handleAgain}>
                                            Thử lại
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            {!words && (
                <Spinner className="spinner" color="primary">
                    Loading
                </Spinner>
            )}
        </div>
    );
}

export default TestVocabulary;
