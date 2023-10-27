import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import getData from '~/data/vocabularySource';

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
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {!!words &&
                    words.map((_, index) => (
                        <Link className={cx('btn')} key={index} to={`/day/${index}`}>
                            Day {index + 1}
                        </Link>
                    ))}
            </div>
            {!words && (
                <Spinner className={cx('spinner')} color="primary">
                    Loading
                </Spinner>
            )}
        </div>
    );
}

export default Home;
