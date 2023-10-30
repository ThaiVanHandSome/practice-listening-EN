import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import getData from '~/data/vocabularySource';

const cx = classNames.bind(styles);
function Home() {
    const [words, setWords] = useState(null);
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
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container', 'mt-lg-0')}>
                {!!words &&
                    words.map((_, index) => (
                        <Link className={cx('btn')} key={index} to={`/day/${index}`}>
                            Day {index + 1}
                        </Link>
                    ))}
                <Link to={'/day/all'} className={cx('btn-all')}>
                    ALL DAY
                </Link>
                <div className={cx('list-btn')}>
                    <Link to={'/translate'} className={cx('btn-translate')}>
                        TRANSLATE
                    </Link>
                    <Link to={'/listen'} className={cx('btn-translate')}>
                        LISTEN
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
