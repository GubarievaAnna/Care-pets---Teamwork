import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { showAlertMessage } from '../../utils/showMessages';
import { loginUser } from '../../redux/auth/authOperations';
import { getAuthError } from '../../redux/auth/authSelectors';
import s from './LoginForm.module.scss';

const LoginForm = () => {
  const { t } = useTranslation();
  const error = useSelector(getAuthError);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },

    validationSchema: Yup.object({
      email: Yup.string()
      .email(t('validation.email'))
      .min(5, t('validation.emailMin'))
      .max(40, t('validation.emailMax'))
      .required(t('validation.required')),
    password: Yup.string()
      .min(6, t('validation.passwordMin'))
      .max(40, t('validation.passwordMax'))
      .required(t('validation.required')),
  }),
  });

  useEffect(() => {
    if (!error) return;
    showAlertMessage(error);
  }, [error]);

  const { email, password } = formik.values;
  const { email: emailError, password: passwordError } = formik.errors;

  const onFormSubmit = e => {
    e.preventDefault();

    if (email === '' || password === '') {
      showAlertMessage(t('errors.allFields'));
      return;
    }
    if (passwordError || emailError) {
      showAlertMessage(t('errors.allFieldsFormat'));
      return;
    }
    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        className={s.input}
        type="email"
        name="email"
        placeholder={`*${t('login.placeholders.email')}`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={email}
      />
      <p className={s.error}>
        {formik.touched.email && emailError && emailError}
      </p>
      <input
        className={s.input}
        type="password"
        name="password"
        placeholder={`*${t('login.placeholders.password')}`}
        onChange={event => {
          formik.setFieldValue('password', event.target.value.trim());
        }}
        onBlur={formik.handleBlur}
        value={password}
      />
      <p className={s['error--last']}>
        {formik.touched.password && passwordError && passwordError}
      </p>
      <button className={`${s.button} ${s.accent}`} type="submit">
        {t('login.button')}
      </button>
    </form>
  );
};

export default LoginForm;
