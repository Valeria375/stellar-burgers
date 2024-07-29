import { FC, useMemo } from 'react';
import { RequestStatus, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
// import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../services/store';
import { userSelectors } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';

import {
  BurgerConstructorActions,
  orderBurger
} from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(userSelectors.getUser);

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const orderRequest =
    useSelector((state: RootState) => state.burgerConstructor.requestStatus) ===
    RequestStatus.Loading;

  const orderModalData = useSelector(
    (state: RootState) => state.burgerConstructor.order
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigation('/login');
    } else {
      const ingredientIds = [
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        constructorItems.bun._id
      ];
      dispatch(orderBurger(ingredientIds));
    }
  };
  const closeOrderModal = () => {
    dispatch(BurgerConstructorActions.resetBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
