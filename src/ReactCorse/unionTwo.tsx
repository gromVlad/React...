//React  /  TypeScript

// @ts-ignore
//Типизация компонент
import { ButtonHTMLAttributes, ReactNode } from 'react';

//расширяет класс и берет станждартные пропсы ButtonHTMLAttributes<HTMLButtonElement> / ReactNode - любой react element
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

import { FC } from 'react';
import './Button.css';
import { ButtonProps } from './Button.props';
import cn from 'classnames';

export const ButtonAlt: FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button className={cn('button accent', className)} {...props}>{children}</button>
  );
}

function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={cn('button accent', className)} {...props}>{children}</button>
  );
}

export default Button;

//-------------------
//Типизация hooks и событий
//Все события в react синтетические, поэтому их следует брать с react
import { MouseEvent, useState } from 'react'

const [counter, setCounter] = useState<number>(0);

const addCounter = (e: MouseEvent) => {
  console.log(e)
}

//-------------------
//Создание кнопки и input

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  appearence?: 'big' | 'small';
}

//Button.tsx
import { ButtonProps } from './Button.props';
import cn from 'classnames';

function Button({ children, className, appearence = 'small', ...props }: ButtonProps) {
  return (
    <button className={cn(styles['button'], styles['accent'], className, {
      [styles['small']]: appearence === 'small',
      [styles['big']]: appearence === 'big'
    })} {...props}>{children}</button>
  );
}

//Input.tsx
import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isValid?: boolean;
}

import { forwardRef } from 'react';
import styles from './Input.module.css';
import cn from 'classnames';
import { InputProps } from './Input.props';

//forwardRef - передаем тот элемент на который будет ref и второй необязательный параметр сама типизация компонента
const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ isValid = true, className, ...props }, ref) {

  return (
    <input ref={ref} className={cn(styles['input'], className, {
      [styles['invalid']]: isValid
    })} {...props} />

  );

});

//-------------------
//роутинг

//main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

//App.tsx
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <div>
        <a href='/'>Меню</a>
        <a href='/cart'>Корзина</a>
      </div>
      <Routes>
        {/* главный роутинг по умолчанию */}
        <Route path='/' element={<Menu />} />
        <Route path='/cart' element={<Cart />} />

        {/* при ошибке роутинга */}
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  )
}

//--------------------
//createBrowserRouter
//более современный способ работы с роутингам

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />
  },
  {
    path: '/cart',
    element: <Cart />
  },
  {
    path: '*',
    element: <Error />
  }
]);

function App() {
  return(
    <>
      <RouterProvider router={router} />
    </>
  )
}

//--------------------
//Link
//чтобы не было перезагрузок страницы и приложения не загружалось заново используем Link. !Вне провайдера route с линками работать не можем

export function Cart() {
  return <>
    <div>
      <Link to='/'>Меню</Link>
      <Link to='/cart'>Корзина</Link>
    </div>
    Cart</>;
}

//-------------------
//Outlet
//Для создание вложенной структруы и использование children используем Outlet

//Menu.tsx
import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return <div>
    <div>
      <Link to='/'>Меню</Link>
      <Link to='/cart'>Корзина</Link>
    </div>

    {/* нужен чтобы вложенная структура приложения работала children нашего Layout,просто добовляем*/}
    <div>
      <Outlet />
    </div>
  </div>;
}

//main.tsx

//сложная вложенная структура роутинга
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Menu />
      },
      {
        path: '/cart',
        element: <Cart />
      }
    ]
  },
  {
    path: '*',
    element: <Error />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

//--------------------
//useLocation
//понять путь накотором мы находимся на странице
import { useLocation } from 'react-router-dom';

const location = useLocation();

//если путь '/' то добавим класс active
<Link to='/' className={cn(styles['link'], {
  [styles.active]: location.pathname === '/'
})}/>

//------------------
//NavLink
//для навигации есть отдельный компонент

//если путь '/' и isActive true то добавим класс active
return (<NavLink to='/' className={({ isActive }) => cn(styles['link'], {
  [styles.active]: isActive
})}/>)

//-------------------
//Упражнение - Заголовок и поиск

//Headling.props.ts
import { HTMLAttributes, ReactNode } from 'react';

export interface HeadlingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

//Headling.tsx
import styles from './Headling.module.css';
import cn from 'classnames';
import { HeadlingProps } from './Headling.props';

function Headling({ children, className, ...props }: HeadlingProps) {
  return (
    <h1 className={cn(className, styles['h1'])} {...props}>{children}</h1>
  );
}

export default Headling;

//----------------
//Упражнение - Карточка товара

//ProductCard.props.ts
export interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
}

//ProductCard.tsx
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { ProductCardProps } from './ProductCard.props';

function ProductCard(props: ProductCardProps) {
  return (
    <Link to={'/'} className={styles['link']}>
      <div className={styles['card']}>
        <div className={styles['head']} style={{ backgroundImage: `url('${props.image}')` }}>
          <div className={styles['price']}>
            {props.price}&nbsp;
            <span className={styles['currency']}>₽</span>
          </div>
          <button className={styles['add-to-cart']}>
            <img src="/cart-button-icon.svg" alt="Добавить в корзину" />
          </button>
          <div className={styles['rating']}>
            {props.rating}&nbsp;
            <img src="/star-icon.svg" alt="Иконка звезды" />
          </div>
        </div>
        <div className={styles['footer']}>
          <div className={styles['title']}>{props.title}</div>
          <div className={styles['description']}>{props.description}</div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

//--------------------
//Роуты с параметрами

//ProductCard.tsx
function ProductCard(props: ProductCardProps) {
  return (
    <Link to={`/product/${props.id}`} className={styles['link']}/>
    )
}

//main.tsx
//cпециальный route с параметром
{
  path: '/product/:id',
  element: <Product />
}

//
import { useParams } from 'react-router-dom';

export function Product() {
  //ловит переданный параметр id (может любое другое название заданное в route)
  const { id } = useParams();

  //показывает id
  return <>
    Product - {id}
  </>;
}

//----------------
//Создание запросов

//API.ts
export const PREFIX = 'https://purpleschool.ru/pizza-api-demo';

//product.interface.ts
export interface Product {
  id: number
  name: string
  price: number
  ingredients: string[]
  image: string
  rating: number
}

//Menu.tsx
import { useEffect, useState } from 'react';

export function Menu() {
  const [products, setProducts] = useState<Product[]>([]);

  const getMenu = async () => {
    try {
      const res = await fetch(`${PREFIX}/products`);
      if (!res.ok) {
        return;
      }
      const data = await res.json() as Product[];
      setProducts(data);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  //....
}

//------------------
//Подключение axios

import axios from 'axios';

const getMenu = async () => {
  try {
    const { data } = await axios.get<Product[]>(`${PREFIX}/products`);
    //setProducts(data);
  } catch (e) {
    console.error(e);}
  }

//----------------
//Обработка загрузки

const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(false);

const getMenu = async () => {
  try {
    setIsLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    const { data } = await axios.get<Product[]>(`${PREFIX}/products`);
    setProducts(data);
    setIsLoading(false);
  } catch (e) {
    console.error(e);
    setIsLoading(false);
    return;
  }
};
//{isLoading && <>Загружаем продукты...</>}

//---------------------
//Обработка ошибок

const [error, setError] = useState<string | undefined>();

const getMenu = async () => {
  try {
    setIsLoading(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    const { data } = await axios.get<Product[]>(`${PREFIX}/products`);
    setProducts(data);
    setIsLoading(false);
  } catch (e) {
    console.error(e);
    //т.к тип unknown надо проверить что нам приходит по факту
    if (e instanceof AxiosError) {
      setError(e.message);
    }
    setIsLoading(false);
    return;
  }
};
//{error && <>{error}</>}

//----------------
//loader
//если зависим от params (данных которые приходят)
//обеспечивает загрузку данных перед render() самого компонента,функция loader() говорит как мы можем загрузить данные перед тем как  отобразить продукт

{
  path: '/product/:id',
  element: <Product />,
  loader: async ({ params }) => {
      const { data } = await axios.get(`${PREFIX}/products/${params.id}`);
      return data;
  }
}

//Product.tsx
import { useLoaderData } from 'react-router-dom';
import { Product } from '../../interfaces/product.interface';

export function Product() {
  const data = useLoaderData() as Product;

  return <>
    Product - {data.name}
  </>;
}

//------------------
//errorElement
//если ошибка в loader либо в самой функции loader

{
  path: '/product/:id',
  element: <Product />,
  errorElement: <>Ошибка</>
  loader: async ({ params }) => {
      const { data } = await axios.get(`${PREFIX}/products/${params.id}`);
      return data;
  }
}

//------------------
//Lazy 
//Ленивая загрузка части компонент которые будем грузить только при переходе к ней

import React, { lazy } from 'react';

//import { Menu } from './pages/Menu/Menu.tsx'; - будет грузить нашу компоненту только при переходе на нее
const Menu = lazy(() => import('./pages/Menu/Menu')); // такой import требует default export Menu

//------------------
//Suspense
//Делает временный обработчик пока наш компонент загружаеться

import React, { Suspense, lazy } from 'react';

{
  path: '/',
  element: <Suspense fallback={<>Загрузка...</>}><Menu /></Suspense>
}

//------------------
//defer и Await
//немного другой синтаксиси обрабокт ошибок и вывода данных

{
  path: '/product/:id',
    element: <Product />,
      errorElement: <>Ошибка</>,
        loader: async ({ params }) => {
          return defer({
            data: new Promise((resolve, reject) => {
              setTimeout(() => {
                axios.get(`${PREFIX}/products/${params.id}`).then(data => resolve(data)).catch(e => reject(e));
              }, 2000);
            })
          });
        }
}

//Product.tsx
import { Await, useLoaderData } from 'react-router-dom';
import { Product } from '../../interfaces/product.interface';
import { Suspense } from 'react';

export function Product() {
  const data = useLoaderData() as { data: Product };

  return <>
    <Suspense fallback={'Загружаю...'}>
      <Await
        resolve={data.data}
      >
        {({ data }: { data: Product }) => (
          <>Product - {data.name}</>
        )}
      </Await>
    </Suspense>
  </>;
}

//-----------------
//Создание входа

//main.tsx
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Suspense fallback={<>Загрузка...</>}><Menu /></Suspense>
        },
        {
          path: '/cart',
          element: <Cart />
        },
        {
          path: '/product/:id',
          element: <Product />,
          errorElement: <>Ошибка</>,
          loader: async ({ params }) => {
            return defer({
              data: new Promise((resolve, reject) => {
                setTimeout(() => {
                  axios.get(`${PREFIX}/products/${params.id}`).then(data => resolve(data)).catch(e => reject(e));
                }, 2000);
              })
            });
          }
        }
      ]
    },
    //логин страница
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <Login />
        }, {
          path: 'register',
          element: <Register />
        }
      ]
    },
    {
      path: '*',
      element: <ErropPage />
    }
  ]);

//AuthLayout.tsx
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return <div className={styles['layout']}>
    <div className={styles['logo']}>
      <img src="/logo.svg" alt="Логотип компании" />
    </div>
    <div className={styles['content']}>
      <Outlet />
    </div>
  </div>;
}

//------------------
//Получение токена

export type LoginForm = {
  email: {
    value: string;
  };
  password: {
    value: string;
  };
}

export function Login() {
  const [error, setError] = useState<string | null>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const target = e.target as typeof e.target & LoginForm;
    const { email, password } = target;
    await sendLogin(email.value, password.value);
  };

  const sendLogin = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${PREFIX}/auth/login`, {
        email,
        password
      });
      console.log(data);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message);
      }
    }

  };

  return <div className={styles['login']}>
    <Headling>Вход</Headling>
    {error && <div className={styles['error']}>{error}</div>}
    <form className={styles['form']} onSubmit={submit}>
      <div className={styles['field']}>
        <label htmlFor="email">Ваш email</label>
        <Input id="email" name='email' placeholder='Email' />
      </div>
      <div className={styles['field']}>
        <label htmlFor="password">Ваш пароль</label>
        <Input id="password" name='password' type="password" placeholder='Пароль' />
      </div>
      <Button appearence="big">Вход</Button>
    </form>
    <div className={styles['links']}>
      <div>Нет акканута?</div>
      <Link to="/auth/register">Зарегистрироваться</Link>
    </div>
  </div>;
}

//--------------------
//JVT 
//имеет неограниченный жизненный цикл, формируеться из наборов данных с алгоритмами шифрование которые содержит зашифрованную информацию. Ключ хранитьться на бэке. Клиент не может шасрифровать эту информцию но когда связываеться с сервером то кидает этот токен который сервер проверяет и при успешной индификации дает доступ к работе. Чтобы токен не попал в руки злоумышлиников  то придумали refresh (ограниченный жизненный цикл, 1-2 дня), этот токен нужен чтобы обновить основной токен. 

//------------------
//Приватные Routes
//проверка на валидность токена

//RequireAuth.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const jwt = null;

  if (!jwt) {
    //переход на login
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

//main.tsx
{
  path: '/',
  element: <Layout />,
  //оборачиваем наш главный компонент чтобы проверка распространилось на все приложения
  element: <RequireAuth><Layout /></RequireAuth>
}

//------------------------
//Хранение в localstorage

//interface.ts
export interface LoginResponse {
  access_token: string;
}

//Login.tsx
const sendLogin = async (email: string, password: string) => {
  try {
      const { data } = await axios.post<LoginResponse>(`${PREFIX}/auth/login`, {
        email,
        password
      })
      console.log(data)
      localStorage.setItem('jwt', data.access_token)
      navigate('/')
  } catch (e) {
    if (e instanceof AxiosError) {
      setError(e.response?.data.message);
    }
  }
}


//RequireAuth.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const jwt = null;

  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    //переход на login
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

//Layout.tsx
const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem('jwt');
  navigate('/auth/login');

  return (
    //...
    <Button className={styles['exit']} onClick={logout}>
      <img src="/exit-icon.svg" alt="Иконка выхода" />
      Выход
    </Button>
  )
};

