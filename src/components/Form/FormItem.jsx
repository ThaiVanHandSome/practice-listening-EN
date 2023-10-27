import { useField } from 'formik';
import classNames from 'classnames/bind';
import styles from './FormItem.module.scss';

const cx = classNames.bind(styles);

export const MyTextInp = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className={cx('form-item')}>
            <label htmlFor={props.id || props.name} className={cx('form-item-title')}>
                {label}
            </label>
            <input type="text" {...field} {...props} className={cx('form-item-inp')} />
            {meta.touched && meta.error ? <div className={cx('error')}>{meta.error}</div> : null}
        </div>
    );
};

export const MyCheckBox = ({ children, ...props }) => {
    props = {
        ...props,
        type: 'checkbox',
    };
    const [field, meta] = useField(props);
    return (
        <div className={cx('form-item')}>
            <div className={cx('checkbox-container')}>
                <div className={cx('checkbox')}>
                    <input {...field} {...props} className={cx('checkbox-inp')} />
                    <div className={cx('checkbox-checked')}></div>
                </div>
                <label className={cx('checkbox-title')}>{children}</label>
            </div>
            {meta.touched && meta.error ? <div className={cx('error')}>{meta.error}</div> : null}
        </div>
    );
};

export const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <div className={cx('form-item')}>
            <label htmlFor={props.id || props.name} className={cx('form-item-title')}>
                {label}
            </label>
            <select {...field} {...props} className={cx('form-item-select')} />
            {meta.touched && meta.error ? <div className={cx('error')}>{meta.error}</div> : null}
        </div>
    );
};
