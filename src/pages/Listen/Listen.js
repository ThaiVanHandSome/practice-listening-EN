import classNames from 'classnames/bind';
import styles from './Listen.module.scss';
// import YG from 'https://youglish.com/public/emb/widget.js';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Listen() {
    useEffect(() => {}, []);
    return (
        <div className={cx('wrapper')}>
            <div id="widget-1"></div>
        </div>
    );
}

export default Listen;
