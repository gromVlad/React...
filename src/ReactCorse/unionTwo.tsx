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

    {/* нужен что вложенная структура приложения работала */}
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

