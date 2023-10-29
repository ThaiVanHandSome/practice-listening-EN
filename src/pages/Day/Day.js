import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Day.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import randomSort from '~/utils/shuffle';
import { Collapse, CardBody, Card } from 'reactstrap';
import routes from '~/config/routes';
import getData from '~/data/vocabularySource';
import { Spinner } from 'reactstrap';
import { updateState } from '~/store/Reducers/stateDay';
import { useDispatch, useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function Day() {
    // const stateDay = useSelector((state) => state.stateDayReducer);
    // const dispatch = useDispatch;
    const savedAppState = JSON.parse(localStorage.getItem('appState'));
    // dispatch(updateState(savedAppState));

    const [words, setWords] = useState(null);

    const [indexQuestion, setIndexQuestion] = useState(0);
    const [voice, setVoice] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [canShowAnswer, setCanShowAnswer] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [complete, setComplete] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    let { id } = useParams();
    const idVal = id === 'all' ? id : parseInt(id);
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
    if (savedAppState.start === true) {
        listEnWords = savedAppState.currList;
    }
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
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
        if (savedAppState.start === true) {
            setIndexQuestion(savedAppState.currIndex);
        }
    }, []);

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

    const handleClickSpeak = () => {
        handlePlay();
        setCanShowAnswer(true);
    };

    const handleNextQuestion = () => {
        handleSaveState();
        setShowAnswer(false);
        setCanShowAnswer(false);
        setIsOpen(false);
        setIndexQuestion((prev) => {
            if (prev !== listEnWords.length - 1) {
                return prev + 1;
            }
            setComplete(true);
        });
    };

    const handlePrevQuestion = () => {
        handleSaveState();
        setShowAnswer(false);
        setCanShowAnswer(false);
        setIsOpen(false);
        setIndexQuestion((prev) => {
            if (prev !== 0) {
                return prev - 1;
            }
            return prev;
        });
    };

    const handleShowAnswer = () => {
        setShowAnswer((prev) => !prev);
    };

    const handleSaveState = () => {
        const payload = {
            currIndex: indexQuestion + 1,
            currList: listEnWords,
            start: true,
        };
        localStorage.setItem('appState', JSON.stringify(payload));
        // dispatch(updateState(payload));
    };

    return (
        <div className={cx('wrapper')}>
            {!!words && (
                <>
                    <div>
                        <Link to={`/test/${idVal}`} className={cx('btn', 'me-lg-4')}>
                            TEST LISTENING
                        </Link>
                        <Link to={`/testvocabulary/${idVal}`} className={cx('btn', 'me-lg-4')}>
                            TEST VOCABULARY
                        </Link>
                    </div>
                    <div className={cx('container', 'p-4', 'w-lg-75')}>
                        {id !== 'all' && <span className={cx('title')}>Day {idVal + 1}</span>}
                        {id === 'all' && <span className={cx('title')}>All Day</span>}
                        <div
                            className={cx(
                                'info d-flex align-items-center justify-content-center flex-column d-lg-block',
                            )}
                        >
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
                        {!complete && !showAnswer && (
                            <FontAwesomeIcon
                                className={cx('icon-speaker')}
                                icon={faVolumeHigh}
                                onClick={handleClickSpeak}
                            />
                        )}
                        {!complete && showAnswer && (
                            <div className={cx('answer-container')}>
                                <h1 className="mb-3" style={{ fontSize: '5rem', textAlign: 'center' }}>
                                    {listEnWords[indexQuestion]}
                                </h1>
                                <div className={cx('list-btn-ans', 'd-flex')}>
                                    <button className={cx('btn', 'me-4')} onClick={toggle}>
                                        View Vietnamese
                                    </button>
                                    <Link to={`/translate/${listEnWords[indexQuestion]}`} className={cx('btn')}>
                                        View Detail
                                    </Link>
                                </div>
                                <Collapse isOpen={isOpen}>
                                    <Card>
                                        <CardBody>
                                            <h1 style={{ fontSize: '2.2rem', opacity: '0.5', textAlign: 'center' }}>
                                                {currWords[listEnWords[indexQuestion]]}
                                            </h1>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </div>
                        )}
                        {!complete && showAnswer && (
                            <div className={cx('icon-speaker-small')}>
                                <FontAwesomeIcon icon={faVolumeHigh} onClick={handlePlay} />
                            </div>
                        )}
                        {complete && (
                            <div className={cx('complete-cotaniner')}>
                                <h1>Complete</h1>
                                <Link className={cx('btn')} to={routes.home}>
                                    Back To Home
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className={cx('list-btn', 'flex-column', 'flex-lg-row')}>
                        <button
                            className={cx('btn', 'me-lg-4', {
                                disable: !canShowAnswer,
                            })}
                            onClick={handleShowAnswer}
                        >
                            Show Answer
                        </button>
                        <button className={cx('btn', 'me-lg-4')} onClick={handleNextQuestion}>
                            Next Question
                        </button>

                        <button className={cx('btn', 'me-lg-4')} onClick={handlePrevQuestion}>
                            Previous Question
                        </button>
                        <Link className={cx('btn', 'me-lg-4')} to={routes.home}>
                            Back To Home
                        </Link>
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

export default Day;
