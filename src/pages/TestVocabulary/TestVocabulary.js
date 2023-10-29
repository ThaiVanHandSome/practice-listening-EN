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
    const [words, setWords] = useState(null);
    const [inpVal, setInpVal] = useState('');
    const [numberOfWrong, setNumberOfWrong] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [pass, setPass] = useState(null);
    const [complete, setComplete] = useState(false);

    const inpRef = useRef(null);

    const [indexQuestion, setIndexQuestion] = useState(0);

    const [voice, setVoice] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);

    let { id } = useParams();
    let currWords = useMemo(() => {
        let currWords = {};
        if (words !== null) {
            if (id === 'all') {
                words.forEach((item) => {
                    currWords = {
                        ...currWords,
                        ...item,
                    };
                });
            } else {
                currWords = words[id];
            }
        }
        return currWords;
    }, [words]);
    let listEnWords = useMemo(() => {
        const list = Object.keys(currWords);
        return list.sort(randomSort);
    }, [currWords]);

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
            // inpRef.current.classList.add(`.${cx('wrong')}`);
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
        setIndexQuestion((prev) => prev + 1);
        reset();
    };

    const handleAgain = () => {
        reset();
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
    return (
        <div className={cx('wrapper')}>
            {!!words && (
                <>
                    <span className={cx('lbl-warning')}>Mỗi câu hỏi bạn được phép trả lời tối đa 3 lần</span>
                    <span className={cx('lbl-notice')}>Bạn còn {3 - numberOfWrong} lần thử</span>
                    <div className={cx('container', 'container-question')}>
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
                                    onChange={(e) => setInpVal(e.target.value)}
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
                                {pass === true && (
                                    <FontAwesomeIcon
                                        className={cx('icon-speaker')}
                                        icon={faVolumeHigh}
                                        onClick={handlePlay}
                                    />
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
