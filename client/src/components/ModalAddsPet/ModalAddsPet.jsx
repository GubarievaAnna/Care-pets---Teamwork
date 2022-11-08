import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-date-picker';
import { showAlertMessage } from '../../utils/showMessages';
import { addPetInUserCard } from '../../redux/user/userOperations';
import imgLoad from '../../images/modals/loadMobile.png';
import sprite from '../../images/icons/sprite.svg';
import s from './ModalAddsPet.module.scss';

const modalContainer = document.getElementById('modal-root');

const ModalAddsPet = ({ setShowModal }) => {
  const [page, setPage] = useState(1);
  const [photo, setPhoto] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') setShowModal(false);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, []);

  const onBackdropClick = e => {
    if (e.currentTarget === e.target) setShowModal(false);
  };

  const onBtnCloseClick = () => {
    setShowModal(false);
  };

  const onPageChange = () => {
    if (page === 1) {
      if (name === '' || breed === '') {
        showAlertMessage('Input all required fields');
        return;
      }

      if (nameError || breedError) {
        showAlertMessage('Input all fields in the necessary format');
        return;
      }

      setPage(2);
      return;
    }
    setPage(1);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      birthday: new Date(),
      breed: '',
      comments: '',
      pet: '',
    },

    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Field must include more tnan 2 characters')
        .max(16, 'Field must be less tnan 16 characters')
        .required('This is a required field'),
      breed: Yup.string()
        .min(2, 'Field must include more tnan 2 characters')
        .max(24, 'Field must be less tnan 24 characters')
        .required('This is a required field'),
      comments: Yup.string()
        .min(8, 'Field must include more tnan 8 characters')
        .max(120, 'Field must be less tnan 120 characters'),
    }),
  });

  const { pet, name, birthday, breed, comments } = formik.values;

  const { name: nameError, breed: breedError, comments: commentsError } = formik.errors;

  useEffect(() => {
    if (!pet) {
      return;
    }

    /* Создаем виртуальную ссылку на загруженный файл */
    const objectUrl = URL.createObjectURL(pet);
    setPhoto(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [pet]);

  const onFormSubmit = async e => {
    e.preventDefault();

    if (commentsError) {
      showAlertMessage('Input field comments in the necessary format or just miss it');
      return;
    }

    const arrayOfData = Object.entries({
      name,
      birthday,
      breed,
      comments,
      pet,
    });
    console.log('modal', birthday);
    const filteredArray = arrayOfData.filter(item => item[1]);
    const info = filteredArray.reduce((previousValue, feature) => {
      return { ...previousValue, [feature[0]]: feature[1] };
    }, {});

    dispatch(addPetInUserCard(info));
    setShowModal(false);
  };

  return createPortal(
    <div className={s.backdrop} onClick={onBackdropClick}>
      <div className={`${s.modal} ${page === 2 && s.modalSecondPage}`}>
        <button type="button" className={s.btnClose} onClick={onBtnCloseClick}>
          <svg className={s.iconClose} aria-label="Close modal" width="16" height="16">
            <use href={sprite + '#close-icon'} />
          </svg>
        </button>
        <form onSubmit={onFormSubmit}>
          {page === 1 && (
            <>
              <h2 className={s.title}>Add pet</h2>
              <label forhtml="name" className={s.label}>
                Name pet<span className={s.accent}>*</span>
              </label>
              <input
                className={s.input}
                type="text"
                name="name"
                id="name"
                placeholder="Type name pet"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={name}
              />
              <p className={s.error}>{formik.touched.name && nameError && nameError}</p>
              <label forhtml="birthday" className={s.label}>
                Date of birth<span className={s.accent}>*</span>
              </label>
              <DatePicker
                clearIcon={null}
                calendarIcon={
                  <svg width={20} height={20}>
                    <use href={sprite + '#icon-calendar'} />
                  </svg>
                }
                format="dd.MM.yyyy"
                className={s.input}
                selected={birthday}
                maxDate={new Date()}
                yearPlaceholder="yyyy"
                monthPlaceholder="mm"
                dayPlaceholder="dd"
                id="birthday"
                name="birthday"
                value={birthday}
                onChange={value => {
                  if (!value) {
                    return;
                  }
                  formik.setFieldValue('birthday', new Date(Date.parse(value)));
                }}
              />
              <p className={s.error}></p>
              <label forhtml="breed" className={s.label}>
                Breed<span className={s.accent}>*</span>
              </label>
              <input
                className={s.input}
                type="text"
                name="breed"
                id="breed"
                placeholder="Type breed"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={breed}
              />
              <p className={s['error--last']}>{formik.touched.breed && breedError && breedError}</p>
              <div className={s.blockOfButtons}>
                <button className={s.button} type="button" onClick={onBtnCloseClick}>
                  Cancel
                </button>
                <button className={s.button} type="button" onClick={onPageChange}>
                  Next
                </button>
              </div>
            </>
          )}
          {page === 2 && (
            <>
              <h2 className={s.titleSecondPage}>Add pet</h2>
              <p className={s.descr}>Add photo and some comments</p>
              <div className={s.loadImgGroup}>
                <label forhtml="file" className={s.labelLoad}>
                  {!photo && <img src={imgLoad} alt="add_photo" width="71" height="71" />}
                  {photo && (
                    <div className={s.thumbLoadImg}>
                      <img src={photo} alt="pet_photo" className={s.loadImage} />
                    </div>
                  )}
                  <input
                    id="file"
                    name="pet"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={event => {
                      formik.setFieldValue('pet', event.currentTarget.files[0]);
                    }}
                    className={s.inputLoad}
                  />
                </label>
              </div>
              <label forhtml="comments" className={s.label}>
                Comments
              </label>
              <textarea
                className={s.textarea}
                name="comments"
                id="comments"
                placeholder="Type comments"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={comments}
              ></textarea>
              <p className={s['error--last']}>
                {formik.touched.comments && commentsError && commentsError}
              </p>
              <div className={s.blockOfButtons}>
                <button className={s.button} type="button" onClick={onPageChange}>
                  Back
                </button>
                <button className={s.button} type="submit">
                  Done
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    modalContainer
  );
};

export default ModalAddsPet;
