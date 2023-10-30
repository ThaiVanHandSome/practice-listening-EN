import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Test.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import getData from '~/data/vocabularySource';
import randomSort from '~/utils/shuffle';
import routes from '~/config/routes';
import { Spinner } from 'reactstrap';

const cx = classNames.bind(styles);

function Test() {
    const savedAppState = JSON.parse(localStorage.getItem('testState'));
    const [words, setWords] = useState(null);
    const [inpVal, setInpVal] = useState(savedAppState?.inpVal || '');
    const [numberOfWrong, setNumberOfWrong] = useState(savedAppState?.numberOfWrong || 0);
    const [answers, setAnswers] = useState(savedAppState?.answers || []);
    const [pass, setPass] = useState(savedAppState?.pass !== undefined ? savedAppState?.pass : null);
    const [complete, setComplete] = useState(savedAppState?.complete || false);

    const inpRef = useRef(null);

    const [indexQuestion, setIndexQuestion] = useState(savedAppState?.indexQuestion || 0);

    const [voice, setVoice] = useState(savedAppState?.voice || null);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);

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
            utterance.rate = 1.2;
            synth.speak(utterance);
        }

        setIsPaused(false);
    };
    const handleVoiceChange = (event) => {
        const voices = window.speechSynthesis.getVoices();
        setVoice(voices.find((v) => v.name === event.target.value));
    };

    const handleSubmit = () => {
        if (indexQuestion === listEnWords.length - 1) {
            setComplete(true);
        }
        setAnswers((prev) => [...prev, inpVal]);
        if (inpVal.toLowerCase().trim() !== listEnWords[indexQuestion].toLowerCase()) {
            setNumberOfWrong((prev) => {
                prev += 1;
                if (prev === 3) {
                    setPass(false);
                }
                return prev;
            });
        } else {
            setPass(true);
        }
    };

    const reset = () => {
        setPass(null);
        setNumberOfWrong(0);
        setAnswers([]);
        setInpVal('');
    };

    const handleNext = () => {
        // handleSaveState();
        setIndexQuestion((prev) => prev + 1);
        reset();
    };

    const handleAgain = () => {
        reset();
    };

    const handleCheckKey = (e) => {
        if (e.keyCode === 13) {
            handleSubmit();
        }
    };

    const handleChange = (e) => {
        setInpVal(e.target.value);
    };

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(listEnWords[indexQuestion]);

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
            voice,
            listEnWords,
            start: true,
        };
        console.log(payload);
        localStorage.setItem('testState', JSON.stringify(payload));
    });
    return (
        <div className={cx('wrapper')}>
            {words && (
                <>
                    <span className={cx('lbl-warning')}>Mỗi câu hỏi bạn được phép trả lời tối đa 3 lần</span>
                    <span className={cx('lbl-notice')}>Bạn còn {3 - numberOfWrong} lần thử</span>
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
                                <FontAwesomeIcon
                                    className={cx('icon-speaker')}
                                    icon={faVolumeHigh}
                                    onClick={handlePlay}
                                />
                                <input
                                    ref={inpRef}
                                    value={inpVal}
                                    type="text"
                                    className={cx('inp-ans')}
                                    placeholder="Enter your answer..."
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={(e) => handleCheckKey(e)}
                                />
                                <button className={cx('btn')} onClick={handleSubmit}>
                                    Submit
                                </button>
                            </>
                        )}
                        {pass !== null && (
                            <div className={'notice-container'}>
                                <h1
                                    className={cx('notice-lbl', {
                                        pass,
                                        'not-pass': pass === false,
                                    })}
                                >
                                    {complete ? 'HOÀN THÀNH' : pass ? 'THÀNH CÔNG' : 'THẤT BẠI'}
                                </h1>
                                <h1 className={cx('true-ans')}>{listEnWords[indexQuestion]}</h1>
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

export default Test;
