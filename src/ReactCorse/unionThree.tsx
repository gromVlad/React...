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


