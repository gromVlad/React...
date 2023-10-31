// _____Redux (Redux Toolkit)______
//единый state менеджер
//У redux есть множество минусов, очень массивным с огромных числом дополнительный действий

//---------------------
//Создание хранилища

//store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;

//main.tsx
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvid er router={router} />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

//----------------------
//Slice пользователя

//store.ts
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user.slice';

export const store = configureStore({
  reducer: {}
	reducer: {
    user: userSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

//slice.ts
import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  jwt: string | null;
}

const initialState: UserState = {
  jwt: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addJwt: (state) => {
      state.jwt = 'sdfsdf';
    },
    logout: (state) => {
      state.jwt = null;
    }
  }
});

export default userSlice.reducer;
export const userActions = userSlice.actions;

//---------------------
//Первый action
//redux devTools плагин для мониторинга состояние store

//Login.tsx
import { useDispatch } from 'react-redux';

const dispatch = useDispatch<AppDispath>();

//add token 
dispatch(userActions.addJwt(data.access_token));

//slice.ts
import { PayloadAction } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addJwt: (state, action: PayloadAction<string>) => {
      state.jwt = action.payload;
    },
    logout: (state) => {
      state.jwt = null;
    }
  }
});

//---------------------
//Хранение данных

//storage.ts
export function loadState<T>(key: string): T | undefined {
  try {
    const jsonState = localStorage.getItem(key);
    if (!jsonState) {
      return undefined;
    }
    return JSON.parse(jsonState);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export function saveState<T>(state: T, key: string) {
  const stringState = JSON.stringify(state);
  localStorage.setItem(key, stringState);
}

//store.ts
export const store = configureStore({
  reducer: {
    user: userSlice
  }
});

//подписываемся на изменения состояние jwt
store.subscribe(() => {
  saveState({ jwt: store.getState().user.jwt }, JWT_PERSISTENT_STATE);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;

//sslice.ts

export const JWT_PERSISTENT_STATE = 'userData';

export interface UserPersistentState {
  jwt: string | null;
}

export interface UserState {
  jwt: string | null;
}

const initialState: UserState = {
	jwt: loadState<UserPersistentState>(JWT_PERSISTENT_STATE)?.jwt ?? null
};
//.....

//------------------
//Запросы в actions (thunk) / Обработка ошибок
// с reduser мы не можем напрямую работать с асинхронными функциями, используем thunk

//user.slice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadState } from './storage';
import { LoginResponse } from '../interfaces/auth.interface';
import axios, { AxiosError } from 'axios';
import { PREFIX } from '../helpers/API';

export const JWT_PERSISTENT_STATE = 'userData';

export interface UserPersistentState {
  jwt: string | null;
}

export interface UserState {
  jwt: string | null;
  loginErrorMessage?: string;
}

const initialState: UserState = {
  jwt: loadState<UserPersistentState>(JWT_PERSISTENT_STATE)?.jwt ?? null
};

export const login = createAsyncThunk('user/login',
  async (params: { email: string, password: string }) => {
    try {
      const { data } = await axios.post<LoginResponse>(`${PREFIX}/auth/login`, {
        email: params.email,
        password: params.password
      });
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new Error(e.response?.data.message);
      }
    }

  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.jwt = null;
    },
    clearLoginError: (state) => {
      state.loginErrorMessage = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.jwt = action.payload.access_token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loginErrorMessage = action.error.message;
    });
  }
});

export default userSlice.reducer;
export const userActions = userSlice.actions;

//Login.tsx
import { AppDispath, RootState } from '../../store/store';

export type LoginForm = {
  email: {
    value: string;
  };
  password: {
    value: string;
  };
}

const navigate = useNavigate();
const dispatch = useDispatch<AppDispath>();
const { jwt, loginErrorMessage } = useSelector((s: RootState) => s.user);

useEffect(() => {
  if (jwt) {
    navigate('/');
  }
}, [jwt, navigate]);

const submit = async (e: FormEvent) => {
  e.preventDefault();
  dispatch(userActions.clearLoginError());
  const target = e.target as typeof e.target & LoginForm;
  const { email, password } = target;
  await sendLogin(email.value, password.value);
};

const sendLogin = async (email: string, password: string) => {
  dispatch(login({ email, password }));
};

//-----------------
//Профиль пользователя

//user.slice.ts

export interface Profile {
  id: number;
  email: string;
  address: string;
  name: string;
  phone: string;
}

export interface UserState {
  jwt: string | null;
  loginErrorMessage?: string;
  profile?: Profile;
}

//thunkApi -  разные манипуляции для работы со store, получить, сбросить, dispatch дополнительный и т.д.
//нужно типизировать - createAsyncThunk (что возырощаем, параметры, state )
export const getProfile = createAsyncThunk<Profile, void, { state: RootState }>('user/getProfile',
  async (_, thunkApi) => {
    const jwt = thunkApi.getState().user.jwt;
    const { data } = await axios.get<Profile>(`${PREFIX}/user/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return data;
  }
);

builder.addCase(getProfile.fulfilled, (state, action) => {
  state.profile = action.payload;
});

//Layout.tsx
const dispatch = useDispatch<AppDispath>();

useEffect(() => {
  dispatch(getProfile());
}, [dispatch]);

//----------------------
//Регистрация

//user.slice.ts

export const register = createAsyncThunk('user/register',
  async (params: { email: string, password: string, name: string }) => {
    try {
      const { data } = await axios.post<LoginResponse>(`${PREFIX}/auth/register`, {
        email: params.email,
        password: params.password,
        name: params.name
      });
      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new Error(e.response?.data.message);
      }
    }
  }
);

builder.addCase(register.fulfilled, (state, action) => {
  if (!action.payload) {
    return;
  }
  state.jwt = action.payload.access_token;
});
builder.addCase(register.rejected, (state, action) => {
  state.registerErrorMessage = action.error.message;
});

//Register.tsx
const dispatch = useDispatch<AppDispath>();

const submit = async (e: FormEvent) => {
  e.preventDefault();
  dispatch(userActions.clearRegisterError());
  const target = e.target as typeof e.target & RegisterForm;
  const { email, password, name } = target;
  dispatch(register({ email: email.value, password: password.value, name: name.value }));
};

//----------------------
//Корзина товаров

//store.ts
export const store = configureStore({
  reducer: {
		user: userSlice,
    cart: cartSlice
  }
});

//cart.slice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  count: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<number>) => {
      const existed = state.items.find(i => i.id === action.payload);
      if (!existed) {
        state.items.push({ id: action.payload, count: 1 });
        return;
      }
      state.items.map(i => {
        if (i.id === action.payload) {
          i.count += 1;
        }
        return i;
      });
    }
  }
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;

//ProductCard.tsx
const dispatch = useDispatch<AppDispath>();

const add = (e: MouseEvent) => {
  e.preventDefault();
  dispatch(cartActions.add(props.id));
};

<button className={styles['add-to-cart']} onClick={add}></button>

//---------------------------
//Поиск товаров

//Menu.tsx

const [filter, setFilter] = useState<string>();

useEffect(() => {
  getMenu(filter);
}, [filter]);

const getMenu = async (name?: string) => {
  try {
    setIsLoading(true)
    const { data } = await axios.get<Product[]>(`${PREFIX}/products`, {
      params: {
        name
      }
    });
    setProducts(data);
    setIsLoading(false);
  } catch (e) {
    //....
  }
}

const updateFilter = (e: ChangeEvent<HTMLInputElement>) => {
  setFilter(e.target.value);
};

return <>
  <Search placeholder='Введите блюдо или состав' onChange={updateFilter} />
  {!isLoading && products.length === 0 && <>Не найдено блюд по запросу</>}
</>

//--------------------
//Корзина

//cart.slice.ts
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { loadState } from './storage';

export const CART_PERSISTENT_STATE = 'cartData';

export interface CartItem {
  id: number;
  count: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = loadState<CartState>(CART_PERSISTENT_STATE) ?? {
  items: []
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clean: (state) => {
      state.items = [];
    },
    delete: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    remove: (state, action: PayloadAction<number>) => {
      const existed = state.items.find(i => i.id === action.payload);
      if (!existed) {
        return;
      }
      if (existed.count === 1) {
        state.items = state.items.filter(i => i.id !== action.payload);
      } else {
        state.items.map(i => {
          if (i.id === action.payload) {
            i.count -= 1;
          }
          return i;
        });
        return;
      }

    },
    add: (state, action: PayloadAction<number>) => {
      const existed = state.items.find(i => i.id === action.payload);
      if (!existed) {
        state.items.push({ id: action.payload, count: 1 });
        return;
      }
      state.items.map(i => {
        if (i.id === action.payload) {
          i.count += 1;
        }
        return i;
      });
    }
  }
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;

//CartItem.tsx
import styles from './CartItem.module.css';
import { useDispatch } from 'react-redux';
import { AppDispath } from '../../store/store';
import { cartActions } from '../../store/cart.slice';
import { CartItemProps } from './CartItem.props';

function CartItem(props: CartItemProps) {
  const dispatch = useDispatch<AppDispath>();

  const increase = () => {
    dispatch(cartActions.add(props.id));
  };

  const descrease = () => {
    dispatch(cartActions.remove(props.id));
  };

  const remove = () => {
    dispatch(cartActions.delete(props.id));
  };


  return (
    <div className={styles['item']}>
      <div className={styles['image']} style={{ backgroundImage: `url('${props.image}')` }}></div>
      <div className={styles['description']}>
        <div className={styles['name']}>{props.name}</div>
        <div className={styles['price']}>{props.price}&nbsp;₽</div>
      </div>
      <div className={styles['actions']}>
        <button className={styles['minus']} onClick={descrease}>
          <img src="/minus-icon.svg" alt="Удалить из корзины" />
        </button>
        <div className={styles['number']}>{props.count}</div>
        <button className={styles['plus']} onClick={increase}>
          <img src="/plus-icon.svg" alt="Добавить в корзину" />
        </button>
        <button className={styles['remove']} onClick={remove}>
          <img src="/delete-icon.svg" alt="Удалить все" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;

//Cart.tsx
import { useDispatch, useSelector } from 'react-redux';
import Headling from '../../components/Headling/Headling';
import { AppDispath, RootState } from '../../store/store';
import CartItem from '../../components/CartItem/CartItem';
import { useEffect, useState } from 'react';
import { Product } from '../../interfaces/product.interface';
import axios from 'axios';
import { PREFIX } from '../../helpers/API';
import styles from './Cart.module.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { cartActions } from '../../store/cart.slice';

const DELIVERY_FEE = 169;

export function Cart() {
  const [cartProducts, setCardProducts] = useState<Product[]>([]);
  const items = useSelector((s: RootState) => s.cart.items);
  const jwt = useSelector((s: RootState) => s.user.jwt);
  const dispatch = useDispatch<AppDispath>();
  const navigate = useNavigate();

  const total = items.map(i => {
    const product = cartProducts.find(p => p.id === i.id);
    if (!product) {
      return 0;
    }
    return i.count * product.price;
  }).reduce((acc, i) => acc += i, 0);


  const getItem = async (id: number) => {
    const { data } = await axios.get<Product>(`${PREFIX}/products/${id}`);
    return data;
  };

  const loadAllItems = async () => {
    const res = await Promise.all(items.map(i => getItem(i.id)));
    setCardProducts(res);
  };

  const checkout = async () => {
    await axios.post(`${PREFIX}/order`, {
      products: items
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    dispatch(cartActions.clean());
    navigate('/success');
  };

  useEffect(() => {
    loadAllItems();
  }, [items]);

  return <>
    <Headling className={styles['headling']}>Корзина</Headling>
    {items.map(i => {
      const product = cartProducts.find(p => p.id === i.id);
      if (!product) {
        return;
      }
      return <CartItem key={product.id} count={i.count} {...product} />;
    })}
    <div className={styles['line']}>
      <div className={styles['text']}>Итог</div>
      <div className={styles['price']}>{total}&nbsp;<span>₽</span></div>
    </div>
    <hr className={styles['hr']} />
    <div className={styles['line']}>
      <div className={styles['text']}>Доставка</div>
      <div className={styles['price']}>{DELIVERY_FEE}&nbsp;<span>₽</span></div>
    </div>
    <hr className={styles['hr']} />
    <div className={styles['line']}>
      <div className={styles['text']}>Итог <span className={styles['total-count']}>({items.length})</span></div>
      <div className={styles['price']}>{total + DELIVERY_FEE}&nbsp;<span>₽</span></div>
    </div>
    <div className={styles['checkout']}>
      <Button appearence="big" onClick={checkout}>оформить</Button>
    </div>
  </>;
}