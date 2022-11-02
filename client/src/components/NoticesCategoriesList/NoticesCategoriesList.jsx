import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
import {
  fetchAdsByCategory,
  fetchFavoriteAds,
  fetchOwnAds,
} from '../../utils/api';
import NoticeCategoryItem from 'components/NoticeCategoryItem/NoticeCategoryItem';

import s from './NoticesCategoriesList.module.scss';

const categoriesForBack = {
  sell: 'sell',
  'lost-found': 'lostFound',
  'for-free': 'inGoodHands',
};

const NoticesCategoriesList = ({ category, searchQuery }) => {
  const [array, setArray] = useState([]);
  const [arrayFavorite, setArrayFavorite] = useState([]);
  const [arrayOwn, setArrayOwn] = useState([]);

  useEffect(() => {
    if (category === 'favorite') {
      fetchFavoriteAds()
        .then(data => setArray(data))
        .catch(error => console.log(error));
      return;
    }

    if (category === 'own') {
      fetchOwnAds()
        .then(data => setArray(data))
        .catch(error => console.log(error));
      return;
    }

    fetchAdsByCategory(categoriesForBack[category])
      .then(data => {
        console.log(data);
        setArray(data);
      })
      .catch(error => console.log(error));

    // eslint-disable-next-line
  }, [category]);

  useEffect(() => {
    if (category === 'favorite') {
      setArray([...arrayFavorite]);
      return;
    }
    if (category === 'own') {
      setArray([...arrayOwn]);
      return;
    }
    // eslint-disable-next-line
  }, [arrayFavorite.length, arrayOwn.length]);

  return (
    <ul className={s.list}>
      {array &&
        array.map(({ _id, ...rest }) => (
          <NoticeCategoryItem
            key={_id}
            data={rest}
            id={_id}
            setArrayFavorite={setArrayFavorite}
            setArrayOwn={setArrayOwn}
            array={array}
          />
        ))}
    </ul>
  );
};

export default NoticesCategoriesList;
