import classNames from 'classnames/bind';
import styles from '../Day/Day.module.scss';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import randomSort from '~/utils/shuffle';
import getData from '~/data/vocabularySource';
import { Card, CardBody, Collapse, Spinner } from 'reactstrap';
import routes from '~/config/routes';

const cx = classNames.bind(styles);

function Review() {
    let { id } = useParams();
    let savedAppState = JSON.parse(localStorage.getItem('reviewState'));
    if (!savedAppState) {
        savedAppState = {};
    }
    let listReviewSuccess = JSON.parse(localStorage.getItem('listReviewSuccess'));
    if (typeof listReviewSuccess !== 'object' || !listReviewSuccess) {
        listReviewSuccess = [];
    }
    const [words, setWords] = useState(null);
    const [indexQuestion, setIndexQuestion] = useState(savedAppState?.indexQuestion || 0);
    const [isOpen, setIsOpen] = useState(savedAppState?.isOpen || false);
    const [complete, setComplete] = useState(savedAppState?.complete || false);
    const toggle = () => setIsOpen(!isOpen);
    const currWords = useMemo(() => {
        let objChoosen = {};
        if (words !== null) {
            if (id === 'all') {
                words.forEach((item) => {
                    objChoosen = {
                        ...objChoosen,
                        ...item,
                    };
                });
            } else {
                objChoosen = words[id];
            }
        }
        return objChoosen;
    }, [words]);
    let listEnWords = useMemo(() => {
        const list = Object.keys(currWords);
        return list.sort(randomSort);
    }, [currWords]);
    if (savedAppState?.start === true && savedAppState?.listEnWords.length !== 0) {
        listEnWords = savedAppState.listEnWords;
    }

    const handleNextQuestion = () => {
        setIsOpen(false);
        setIndexQuestion((prev) => {
            if (prev !== listEnWords.length - 1) {
                return prev + 1;
            }
            if (!listReviewSuccess.includes(parseInt(id))) {
                listReviewSuccess.push(parseInt(id));
            }
            localStorage.setItem('listReviewSuccess', JSON.stringify(listReviewSuccess));
            setComplete(true);
        });
    };

    const handlePrevQuestion = () => {
        setIsOpen(false);
        setIndexQuestion((prev) => {
            if (prev !== 0) {
                return prev - 1;
            }
            return prev;
        });
    };

    useEffect(() => {
        const getVocabulary = async () => {
            const data = await getData();
            setWords(data);
        };
        getVocabulary();
    }, []);

    useEffect(() => {
        const payload = {
            indexQuestion,
            listEnWords,
            isOpen,
            complete,
            start: true,
        };
        localStorage.setItem('reviewState', JSON.stringify(payload));
    });
    return (
        <div className={cx('wrapper')}>
            {!!words && (
                <>
                    <div className={cx('container', 'p-4', 'w-lg-75')}>
                        {id !== 'all' && <span className={cx('title')}>Day {parseInt(id) + 1}</span>}
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
                            </div>
                        </div>
                        {!complete && (
                            <div className={cx('answer-container')}>
                                <h1
                                    className="mb-3"
                                    style={{ fontSize: '8rem', textAlign: 'center', marginBottom: '64px' }}
                                >
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
                        <Link className={cx('btn', 'me-lg-4')} to={routes.home}>
                            Back To Home
                        </Link>
                        <button className={cx('btn', 'me-lg-4')} onClick={handlePrevQuestion}>
                            Previous Question
                        </button>
                        <button className={cx('btn', 'me-lg-4')} onClick={handleNextQuestion}>
                            Next Question
                        </button>
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

export default Review;
