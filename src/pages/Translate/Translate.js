import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Translate.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

import useDebounce from '~/hooks/useDebounce';
import { useEffect, useMemo, useState } from 'react';

import handleTranslate from '~/services/apiServices/translate';
import { Spinner } from 'reactstrap';

const cx = classNames.bind(styles);

function Translate() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const [voice, setVoice] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);

    const debouncedVal = useDebounce(text);

    const { q } = useParams();

    const handleChangeInp = (e) => {
        setText(e.target.value);
    };

    useEffect(() => {
        if (!debouncedVal) {
            setResult('');
            return;
        }
        const getRes = async () => {
            const res = await handleTranslate(debouncedVal);
            setResult(res);
        };
        getRes();
    }, [debouncedVal]);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(debouncedVal);
        // const voices = synth.getVoices();

        setVoice(voice);
        setUtterance(u);

        return () => {
            synth.cancel();
        };
    }, [debouncedVal]);

    useEffect(() => {
        if (q) {
            setText(q);
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

    const otherWords = useMemo(() => {
        const otherWords = {};
        otherWords.nouns = [];
        otherWords.verbs = [];
        if (!result.dict) return otherWords;
        result.dict.forEach((item) => {
            const list = item.split(',');
            if (list[0].includes('noun')) {
                list[0] = list[0].replace('noun:', '').trim();
                otherWords.nouns = list;
            } else if (list[0].includes('verb')) {
                list[0] = list[0].replace('verb:', '').trim();
                otherWords.verbs = list;
            }
        });
        return otherWords;
    }, [result]);

    return (
        <div className={cx('wrapper')}>
                <div className={cx('container', 'w-lg-75', 'p-4')}>
                    <div className="row">
                        <div className="col">
                            <div className="d-flex align-items-center justify-content-center">
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
                    <div className="row">
                        <div className="col-12 col-lg-5">
                            <div className={cx('inp-container')}>
                                <span className={cx('inp-lbl')}>English</span>
                                <textarea
                                    value={text}
                                    type="text"
                                    className={cx('inp', 'inp-txt')}
                                    onChange={(e) => handleChangeInp(e)}
                                    placeholder="Enter word..."
                                />
                                <FontAwesomeIcon
                                    className={cx('icon-speaker')}
                                    icon={faVolumeHigh}
                                    onClick={handlePlay}
                                />
                            </div>
                        </div>
                        <div className="d-none d-lg-block col-lg-2">
                            <div className={cx('icon-container')}>
                                <FontAwesomeIcon className={cx('arrow-icon')} icon={faArrowRight} />
                            </div>
                        </div>
                        <div className="col-12 col-lg-5">
                            <div className={cx('inp-container')}>
                                <span className={cx('inp-lbl')}>Vietnamese</span>
                                <textarea
                                    value={!result ? '' : result.result[0]}
                                    readOnly
                                    type="text"
                                    className={cx('inp', 'res-txt')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('other-words')}>
                        <span className={cx('lbl')}>Bản dịch khác</span>
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <div className={cx('words-container')}>
                                    <span>Noun</span>
                                    <div className={cx('list-words')}>
                                        {otherWords.nouns.map((word, index) => (
                                            <span key={index} className={cx('words')}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className={cx('words-container')}>
                                    <span>Verb</span>
                                    <div className={cx('list-words')}>
                                        {otherWords.verbs.map((word, index) => (
                                            <span key={index} className={cx('words')}>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('exp-sentences')}>
                        <span className={cx('lbl')}>Một số câu ví dụ</span>
                        <ul>
                            {result &&
                                result.example &&
                                result.example.map((senten, index) => {
                                    const htmlStr = { __html: senten };
                                    return <li key={index} dangerouslySetInnerHTML={htmlStr}></li>;
                                })}
                        </ul>
                    </div>
                </div>
        </div>
    );
}

export default Translate;
