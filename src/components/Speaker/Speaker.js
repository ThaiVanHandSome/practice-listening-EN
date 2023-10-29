import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Speaker.module.scss';

const cx = classNames.bind(styles);

function Speaker() {
    const [voice, setVoice] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);
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
    return (
        <div className={cx('wrapper')}>
            <label className={cx('choose-voice')}>
                <span>Voice: </span>
                <select className={cx('select-speaker')} value={voice?.name} onChange={handleVoiceChange}>
                    {window.speechSynthesis.getVoices().map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}
export default Speaker;
