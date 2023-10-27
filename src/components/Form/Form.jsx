import classNames from 'classnames/bind';
import { Form as FormBox, Formik } from 'formik';
import * as Yup from 'yup';
import styles from './Form.module.scss';

const cx = classNames.bind(styles);

function Form() {
    return (
        <div className={cx('wrapper')}>
            <h1>{/* title of your form */}</h1>
            <Formik initialValues={{}} validationSchema={Yup.object()} onSubmit={(values) => {}}>
                <FormBox>
                    {/* Add form item into it */}
                    <button type="submit" className={cx('btn-submit')}>
                        {/* Content of button */}
                    </button>
                </FormBox>
            </Formik>
        </div>
    );
}

export default Form;
