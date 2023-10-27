import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);
function Home() {
    const words = useSelector((state) => state.wordsReducer);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {words.map((_, index) => (
                    <Link className={cx('btn')} key={index} to={`/day?id=${index}`}>
                        Day {index + 1}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home;
