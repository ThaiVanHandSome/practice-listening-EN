import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import getData from '~/data/vocabularySource';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord, faGraduationCap, faHeadphones } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function Home() {
    const [words, setWords] = useState(null);
    let listReviewSuccess = JSON.parse(localStorage.getItem('listReviewSuccess')) || [];
    // console.log(typeof words);
    useEffect(() => {
        const getVocabulary = async () => {
            const data = await getData();
            setWords(data);
        };
        getVocabulary();
    }, []);

    useEffect(() => {
        localStorage.removeItem('dayState');
        localStorage.removeItem('testState');
        localStorage.removeItem('testVocaState');
        localStorage.removeItem('reviewState');
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container', 'mt-lg-0')}>
                {!!words &&
                    words.map((_, index) => (
                        <Link className={cx('btn', {
                            'disable': index === 6
                        })} key={index} to={`/day/${index}`}>
                            Day {index + 1}
                            <div className={cx('icons-state')}>
                                <FontAwesomeIcon
                                    icon={faGraduationCap}
                                    className={cx('icons-state-item', { success: listReviewSuccess.includes(index) })}
                                />
                                <FontAwesomeIcon icon={faHeadphones} className={cx('icons-state-item')} />
                                <FontAwesomeIcon icon={faFileWord} className={cx('icons-state-item')} />
                            </div>
                        </Link>
                    ))}
                <Link to={'/day/all'} className={cx('btn-all')}>
                    ALL DAY
                </Link>
                <div className={cx('list-btn')}>
                    <Link to={'/translate'} className={cx('btn-translate')}>
                        TRANSLATE
                    </Link>
                </div>
            </div>
            {!words && (
                <Spinner className="spinner" color="primary">
                    Loading
                </Spinner>
            )}
        </div>
    );
}

export default Home;
