import classNames from 'classnames/bind';
import styles from './Test.module.scss';

const cx = classNames.bind(styles);

function Test() {
    return <div className={cx('wrapper')}></div>;
}

export default Test;
