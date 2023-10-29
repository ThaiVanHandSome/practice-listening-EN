import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import getData from '~/data/vocabularySource';
import routes from '~/config/routes';

const cx = classNames.bind(styles);
function Home() {
    const [words, setWords] = useState(null);
    useEffect(() => {
        const getVocabulary = async () => {
            const data = await getData();
            setWords(data);
        };
        getVocabulary();
    }, []);

    useEffect(() => {
        const payload = {
            currIndex: 0,
            currList: [],
            start: false,
        };
        localStorage.setItem('appState', JSON.stringify(payload));
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {!!words &&
                    words.map((_, index) => (
                        <Link className={cx('btn')} key={index} to={`/day/${index}`}>
                            Day {index + 1}
                        </Link>
                    ))}
                <Link to={'/translate'} className={cx('btn', 'btn-translate')}>
                    TRANSLATE
                </Link>
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
