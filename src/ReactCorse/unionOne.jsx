//React
//компоненты - переиспользуемость, разделения ответсвености, компонент это функция в новой версии (ранее были функциональные компоненты)
//jsx - аналог который описывает нашу разметку, синтаксический сахар
//функцию оборачиваем в коревой элемент в внутрь ложим остальные элементы <></>
//Декларативное описание нашего кода

//---------------------
//Компонент
const Btn = () => {
  return (
    <>
      <button>Сохранить</button>
    </>
  );
};

//----------------------
//Стилизация
function Btn() {
  return <button className="button accent">Сохранить</button>;
}

/* .accent {
	background: #312EB5;
} */

//------------------------
//Динамические данные
function JournalItem() {
  const title = 'Подготовка к обновлению курсов';
  const date = new Date();
  const text = 'Горные походы открывают удивительные природные ландшафт';

  return (
    <div className="journal-item">
      <h2 className="journal-item__header">{title}</h2>
      <h2 className="journal-item__body">
        <div className="journal-item__date">{date.toString()}</div>
        <div className="journal-item__text">{text}</div>
      </h2>
    </div>
  );}

//--------------------
//props
//return ( ... 
<JournalItem title={data[0].title} text={data[0].text} date={data[0].date} />;

const JournalItem = ({ title, text, date }) => {
  const format = new Intl.DateTimeFormat("ru-Ru").format(date);

  return (
    <div className="journal-item">
      <h2 className="journal-item__header">{title}</h2>
      <h2 className="journal-item__body">
        <div className="journal-item__date">{format}</div>
        <div className="journal-item__text">{text}</div>
      </h2>
    </div>
  );
};

//---------------------
//Композиция
//передаем children (компонент или елемент разметки внутрь кнопки)
const CardButton = ({ children }) => {
  return <button className="card-button">{children}</button>;
};

//-----------------
//Обработка событий
//onClick ... есть огромное число обработчиков событий
function Button() {
  const clicked = () => {
    console.log("Привет!");
  };

  return (
    <button onClick={clicked} className="button accent">
      Сохранить
    </button>
  );
}

//------------------
//Отрисовка компонент
<React.StrictMode></React.StrictMode> - нужен 
 const Button = () => {
  // let text = 'Сохранить';
  ////текущее состояние и функция измнения
  const [text, setText] = useState("Сохранить");
  console.log("Ререндер");

  const clicked = () => {
    setText((t) => t + "!");//изменяем состояние на основе предыдущего
    console.log(text); // все равно будет "Сохранить" он уже далее изменит и перерендерит на другое значения , в будущем
  };

  return (
    <button onClick={clicked} className="button accent">
      {text}
    </button>
  );
};

//--------------
//Работа с input
const inputChange = (event) => {
  console.log(event.target.value);// input value
};
<input type="text" onChange={inputChange} />;

//------------------
//Управляемые контролы (связывание)
const [inputData, setInputData] = useState("");

const inputChange2 = (event) => {
  setInputData(event.target.value);
  console.log(inputData);
};
//связывание состояние с помощью value - текущее значение которое будет подтягиваться с useState()
<input type="text" value={inputData} onChange={inputChange2} />;

//---------------------
//Отправка формы

function JournalForm() {
  const [inputData, setInputData] = useState("");

  const inputChange = (event) => {
    setInputData(event.target.value);
    console.log(inputData);
  };

  const addJournalItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    console.log(formProps); //get all value with form
  };

  return (
    <form className="journal-form" onSubmit={addJournalItem}>
      <input type="text" name="title" />
      <input type="date" name="date" />
      <input type="text" name="tag" value={inputData} onChange={inputChange} />
      <textarea name="post" id="" cols="30" rows="10"></textarea>
      <Button
        text="Сохранить"
        onClick={() => {
          console.log("Нажали");
        }}
      />
    </form>
  );
}

//-------------------------
//Statefull и Stateless
//Stateless  - контролируеться из вне
//Statefull - конроль внутри компоненты

//-----------------------
//Особенности useState
//React постоянно сравнивает старое состояние и новое состояние, и если состояние отличаеться его нужно отоброзить. С примитивами легко менять состояние но когда у нас в работе объекты (ссылочный тип данных) для react они равны, мы должнф явно сказать что он стал другим объектом. В случае например массива используем [...state]

//----------------------
//Работа со списком данных (Отображение данных)
{
  data.map((el) => (
    <CardButton>
      <JournalItem title={el.title} text={el.text} date={el.date} />
    </CardButton>
  ));
}

//Добавление элементов

//app
const INITIAL_DATA = [
  {
    title: "Подготовка к обновлению курсов",
    text: "Горные походы открывают удивительные природные ландшафт",
    date: new Date(),
  },
  {
    title: "Поход в годы",
    text: "Думал, что очень много времени",
    date: new Date(),
  },
];

const [items, setItems] = useState(INITIAL_DATA);


const addItem = (item) => {
  setItems((oldItems) => [
    ...oldItems,
    {
      text: item.text,
      title: item.title,
      //преобразуем в нужный формат
      date: new Date(item.date),
    },
  ]);
};

//return ( ...
<JournalList>
  {items.map((el) => (
    <CardButton>
      <JournalItem title={el.title} text={el.text} date={el.date} />
    </CardButton>
  ))}
</JournalList>;

<Body>
  <JournalForm onSubmit={addItem} />
</Body>;
// ... )

//JournalForm.jsx;
function JournalForm({ onSubmit }) {
  const addJournalItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    onSubmit(formProps);
  };

  return (
    <form className="journal-form" onSubmit={addJournalItem}>
      <input type="text" name="title" />
      <input type="date" name="date" />
      <input type="text" name="tag" />
      <textarea name="post" id="" cols="30" rows="10"></textarea>
      <Button
        text="Сохранить"
        onClick={() => {
          console.log("Нажали");
        }}
      />
    </form>
  );
}

//Key в списках
//без ключа мы вынуждены перерендировать весь список и возникать колизии, ключ react показывает куда нам добовлять элемент. Ключ точка привязки, должен быть уникальный параметр

//app.jsx
const INITIAL_DATA2 = [
  {
    id: 1,
    title: "Подготовка к обновлению курсов",
    text: "Горные походы открывают удивительные природные ландшафт",
    date: new Date(),
  },
  {
    id: 2,
    title: "Поход в годы",
    text: "Думал, что очень много времени",
    date: new Date(),
  },
];

const addItem2 = (item) => {
  setItems((oldItems) => [
    ...oldItems,
    {
      text: item.text,
      title: item.title,
      date: new Date(item.date),
      id: oldItems.length > 0 ? Math.max(...oldItems.map((i) => i.id)) + 1 : 1,
    },
  ]);
};

const sortItems = (a, b) => {
  if (a.date < b.date) {
    return 1;
  } else {
    return -1;
  }
};

//return ( ...
{
  items.sort(sortItems).map((el) => (
    <CardButton key={el.id}>
      <JournalItem title={el.title} text={el.text} date={el.date} />
    </CardButton>
  ));
}
// ... )

//-------------------
//Отображение по условию

//JournalList.jsx;
function JournalList({ items }) {
  if (items.length === 0) {
    return <p>Записей пока нет, добавьте первую</p>;
  }
  const sortItems = (a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  };

  return (
    <>
      {items.sort(sortItems).map((el) => (
        <CardButton key={el.id}>
          <JournalItem title={el.title} text={el.text} date={el.date} />
        </CardButton>
      ))}
    </>
  );
}

//----------------------
//React Dev Tools
//использовать для проверки работоспособности компонент, state, и другой дополнительной информации (props, render и т.д.)

//--------------------
//Отладка приложения
//Можно отлаживать код с помощью  Dev Tools точек остонов в sorces -> получим все элементы и компоненты и может по точкам ходить видеть scope изменение данных и видеть ошибки.
//второй удобный способ в vs code нажать запуск и отладка выбираем тип приложения -> далее добовляет нам конфигурацию (тут есть все функции как и в Dev Tools)

//----------------------
//Изменение стилей
//также стили должны отвечать за валидность формы и т.д.

//сделали ручную валидацию компонент
function JournalForm({ onSubmit }) {
  const [formValidState, setFormValidState] = useState({
    title: true,
    post: true,
    date: true,
  });

  const addJournalItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    let isFormValid = true;
    if (!formProps.title?.trim().length) {
      setFormValidState((state) => ({ ...state, title: false }));
      isFormValid = false;
    } else {
      setFormValidState((state) => ({ ...state, title: true }));
    }
    if (!formProps.post?.trim().length) {
      setFormValidState((state) => ({ ...state, post: false }));
      isFormValid = false;
    } else {
      setFormValidState((state) => ({ ...state, post: true }));
    }
    if (!formProps.date) {
      setFormValidState((state) => ({ ...state, date: false }));
      isFormValid = false;
    } else {
      setFormValidState((state) => ({ ...state, date: true }));
    }
    if (!isFormValid) {
      return;
    }
    onSubmit(formProps);
  };

  return (
    <form className="journal-form" onSubmit={addJournalItem}>
      <input
        type="text"
        name="title"
        style={{ border: formValidState.title ? undefined : "1px solid red" }}
      />
      <input
        type="date"
        name="date"
        style={{ border: formValidState.date ? undefined : "1px solid red" }}
      />
      <input type="text" name="tag" />
      <textarea
        name="post"
        id=""
        cols="30"
        rows="10"
        style={{ border: formValidState.post ? undefined : "1px solid red" }}
      ></textarea>
      <Button text="Сохранить" />
    </form>
  );
}

//-------------------------
//Динамические классы
//использование классов при валидации

/* .invalid {
	border: 1px solid red;
	background: rgb(68, 6, 6);
} */

//function JournalForm({ onSubmit }) {
<input
  type="text"
  name="title"
  className={`input ${formValidState.title ? "" : "invalid"}`}
/>;
//...}

//-----------------------
//CSS модули
//Чтобы стили не путались в нашем приложении его необходимо динамический менять

//.module.css добовляет дополнительный постфикс , и никогда не будет колизии стилей
import styles from "./Header.module.css";

function Header() {
  return <img className={styles.logo} src="/logo.svg" alt="Логотип журнала" />;
}
//также можно обращаться через [] или когда стили через дефис _-_ -> styles["logo"]}

//----------------------
//Библиотека classnames
//npm install classnames
//просто функция котопая объединяет в себе несколько классов сразу

import cn from 'classnames';

/* Вместо <input
  type="text"
  name="title"
  className={`input ${formValidState.title ? "" : "invalid"}`}
/>; */useEffect
//sideEffect - rjulf gjkmpjdfntkm xnj nj bpvtyztn e 
<input
  type="text"
  name="title"
  className={cn(styles["input"], {
    //пишем условия после :
    [styles["invalid"]]: !formValidState.title,
  })}
/>;

//также счерез заяпятую можно добовлять сразу множество стилей {cn(styles["input"], [styles["invalid"])}

//----------------------
//useEffect
//sideEffect - когда пользователь что-то изменяет то тогда react обрабатывает значение и перендерит приложения. Но за счет такое работы react мы не можем реализовать работу с сервером, таймеры т.к. они постоянно меняються и будут заставлять перерендерить компоненты. UseEffect позволяет работать с sideEffect такими как localStorage , таймеры, запросы к API. 

import { useEffect, useState } from 'react';

const [items, setItems] = useState([]);

	useEffect(() => {

    //подгружаем localStorage если  есть
		const data = JSON.parse(localStorage.getItem('data'));
		if (data) {
			setItems(data.map(item => ({
				...item,
				date: new Date(item.date)
			})));
		}
	}, []); // [] -> в массиве пишем зависемости от которых будет срабатывать функция () => в useEffect, если пустой массив то он сработает минимум один раз при отрисовке компоненты

  //------------------
  //Зависимости эффекта

  //сохроняем в localStorage
  useEffect(() => {
		if (items.length) {
			console.log('Запись!');
			localStorage.setItem('data', JSON.stringify(items));
		}
	}, [items]); // зависемость от items

  //--------------------
  //Очистка эффекта
  //При использовании таймеров они могут работать паралельно не будут накладываться друг на друга , будут колизии и т.д. поэтому нам надо сделать очистку перед стартом нового эффекта

  const INITIAL_STATE = {
	title: true,
	post: true,
	date: true
};

function JournalForm({ onSubmit }) {
	const [formValidState, setFormValidState] = useState(INITIAL_STATE);

	useEffect(() => {
		let timerId;
		if (!formValidState.date || !formValidState.post || !formValidState.title) {
			timerId = setTimeout(() => {
				console.log('Очистка состояния');
				setFormValidState(INITIAL_STATE);
			}, 2000);
		}
		return () => {
			clearTimeout(timerId);
		};
	}, [formValidState]);
}

//---------------
//Использование useReducer
//используеться когда есть множество точек измнения состояние
//по сути начальная версия redux
import { useEffect, useReducer } from 'react';
//как usestate только с большим функционалом

//state - состояние, dispatch - функция изменения,reduceFN - функция изменения состояние по actions,  init_state - начальное состояние, initFn - функция для учтановки начального состояния
const [state,dispatch] = useReducer(reduceFN,init_state,initFn)

//JournalForm.state.js
export const INITIAL_STATE = {
	isValid: {
		post: true,
		title: true,
		date: true
	},
	values: {
		post: '',
		title: '',
		date: '',
		tag: ''
	},
	isFormReadyToSubmit: false
};

export function formReducer(state, action) {
	switch(action.type) {
	case 'SET_VALUE':
		return { ...state, values: { ...state.values, ...action.payload}};
	case 'CLEAR':
		return { ...state, values: INITIAL_STATE.values,isFormReadyToSubmit: false};
	case 'RESET_VALIDITY':
		return { ...state, isValid: INITIAL_STATE.isValid};
	case 'SUBMIT' : {
		const titleValidity = state.values.title?.trim().length;
		const postValidity = state.values.post?.trim().length;
		const dateValidity = state.values.date;
		return {
			...state,
			isValid: {
				post: postValidity,
				title: titleValidity,
				date: dateValidity
			},
			isFormReadyToSubmit: titleValidity && postValidity && dateValidity
		};
	}
	}
}

//JournalForm.jsx
import styles from './JournalForm.module.css';
import Button from '../Button/Button';
import { useEffect, useReducer } from 'react';
import cn from 'classnames';
import { INITIAL_STATE, formReducer } from './JournalForm.state';

function JournalForm({ onSubmit }) {
	const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
	const { isValid, isFormReadyToSubmit, values } = formState;

	useEffect(() => {
		let timerId;
		if (!isValid.date || !isValid.post || !isValid.title) {
			timerId = setTimeout(() => {
				console.log('Очистка состояния');
				dispatchForm({ type: 'RESET_VALIDITY' });
			}, 2000);
		}
		return () => {
			clearTimeout(timerId);
		};
	}, [isValid]);

	useEffect(() => {
		if (isFormReadyToSubmit) {
			onSubmit(values);
			dispatchForm({ type: 'CLEAR' });
		}
	}, [isFormReadyToSubmit, values, onSubmit]);

	const onChange = (e) => {
		dispatchForm({ type: 'SET_VALUE', payload: { [e.target.name]: e.target.value }});
	};

	const addJournalItem = (e) => {
		e.preventDefault();
		dispatchForm({ type: 'SUBMIT' });
	};

	return (
		<form className={styles['journal-form']} onSubmit={addJournalItem}>
			<div>
				<input type='text' onChange={onChange} value={values.title} name='title' className={cn(styles['input-title'], {
					[styles['invalid']]: !isValid.title
				})}/>
			</div>
			<div className={styles['form-row']}>
				<label htmlFor="date" className={styles['form-label']}>
					<img src='/calendar.svg' alt='Иконка календаря'/>
					<span>Дата</span>
				</label>
				<input type='date' onChange={onChange} name='date' value={values.data} id="date" className={cn(styles['input'], {
					[styles['invalid']]: !isValid.date
				})} />
			</div>
			<div className={styles['form-row']}>
				<label htmlFor="tag" className={styles['form-label']}>
					<img src='/folder.svg' alt='Иконка папки'/>
					<span>Метки</span>
				</label>
				<input type='text' onChange={onChange} id="tag" value={values.tag} name='tag' className={styles['input']} />
			</div>
			<textarea name="post" id="" onChange={onChange} value={values.post} cols="30" rows="10" className={cn(styles['input'], {
				[styles['invalid']]: !isValid.post
			})}></textarea>
			<Button text="Сохранить" />
		</form>
	);
}

export default JournalForm;

//---------------------
//useRef
//ссылка на элемент

const titleRef = useRef();
	const dateRef = useRef();
	const postRef = useRef();

	const focusError = (isValid) => {
		switch(true) {
		case !isValid.title:
			titleRef.current.focus();
			break;
		case !isValid.date:
			dateRef.current.focus();
			break;
		case !isValid.post:
			postRef.current.focus();
			break;
		}
	};

  useEffect(() => {
		let timerId;
		if (!isValid.date || !isValid.post || !isValid.title) {
			focusError(isValid);
			timerId = setTimeout(() => {
				dispatchForm({ type: 'RESET_VALIDITY' });
			}, 2000);
		}
  })

  return (
		<input type='text' ref={titleRef} onChange={onChange} value={values.title} name='title' className={cn(styles['input-title'], {
		[styles['invalid']]: !isValid.title
	  })}/>
    //...
)

//-------------------
//forwardRef
//для того чтобы передать useRef дальше опрокинуть в универсальную компоненту нам надо использовать обертку forwardRef

import { forwardRef } from 'react';
import styles from './Input.module.css';
import cn from 'classnames';

//...prop - по умолчанию которые использует input
const Input = forwardRef(({ isValid, appearance = 'text', className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(className, {
        [styles.invalid]: isValid,
        [styles['input-title']]: appearance === 'title',
        [styles.input]: appearance === 'text'
      })}
      {...props}
    />
  );
});

{/* <Input type='text' ref={titleRef} onChange={onChange} value={values.title} name='title' isValid={!isValid.title}/> */}

//----------------------
//Создание своего hook

//hook.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key) {
	const [data, setData] = useState();

	useEffect(() => {
		const res = JSON.parse(localStorage.getItem(key));
		if (res) {
			setData(res);
		}
	}, []);

	const saveData = (newData) => {
		localStorage.setItem(key, JSON.stringify(newData));
		setData(newData);
	};

	return [data, saveData];
}

//App.jsx
function mapItems(items) {
	if (!items) {
		return [];
	}
	return items.map(i => ({
		...i,
		date: new Date(i.date)
	}));
}

function App() {
	const [items, setItems] = useLocalStorage('data');

	const addItem = item => {
		setItems([...mapItems(items), {
			post: item.post,
			title: item.title,
			date: new Date(item.date),
			id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
		}]);
	};
  //....
}

//Правило работы hook - можем использовать в компонентах и кастомных хуках, вызывать можем только на верхнем уровне, не можем использовать их в if,hook с приставкой use__....

//--------------------------
//Context API
//например при изменении пользователя наш нужно эту информацию через props сообщить другим компонентам , цепочка props будет разрастаться. Context API - помогает связывать без опрокидавние props что сокращает код.

//старый подход
//context.js
import { createContext } from 'react';

export const UserContext = createContext({
	userId: 1
});

//App.jsx
const [userId, setUserId] = useState(1);

return (
		<UserContext.Provider value={{ userId, setUserId }}>
			<div className='app'>
				<LeftPanel>
					<Header/>
					<JournalAddButton/>
					<JournalList items={mapItems(items)} />
				</LeftPanel>
				<Body>
					<JournalForm onSubmit={addItem}/>
				</Body>
			</div>
		</UserContext.Provider>
	);

//JournalForm.jsx
return (
		<UserContext.Consumer>
			{(context) => (
				<form className={styles['journal-form']} onSubmit={addJournalItem}>
					{context.userId}
          {/* context.setUserId(userId + 1) */}
				</form>
			)}

		</UserContext.Consumer>
	);

//c использование hook useContext()
//JournalForm.jsx
import { useContext } from 'react';
import { UserContext } from '../../context/user.context';

function SelectUser() {
	const { userId, setUserId } = useContext(UserContext);

	const changeUser = (e) => {
		setUserId(Number(e.target.value));
	};
	
	return (
		<select name="user" id="user" value={userId} onChange={changeUser}>
			<option value="1">Антон</option>
			<option value="2">Вася</option>
		</select>
	);
}

//------------------------
//Custom context

//context.jsx
import { createContext } from 'react';
import { useState } from 'react';

export const UserContext = createContext({
	userId: 1
});

//будем оборачивать нужные элементы чтобы передать контектст
export const UserContextProvidev = ({ children }) => {
	const [userId, setUserId] = useState(1);

	return <UserContext.Provider value={{ userId, setUserId }}>
		{children}
	</UserContext.Provider>;
};

//----------------------
//работа контекста

//src/components/JournalList/JournalList.jsx
function JournalList({ items }) {
  const { userId } = useContext(UserContext);

  return	<>
		{items
			.filter(el => el.userId === userId)
			.sort(sortItems)
			.map(el => (
				<CardButton key={el.id}>
					<JournalItem 
						title={el.title}
						post={el.post}
						date={el.date}
					/>
				</CardButton>
			))}
	</>;
}

//App.jsx
const { userId } = useContext(UserContext);

function addItem(item) {
  setItems([...mapItems(items), {
    ...item,
    date: new Date(item.date),
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
  }]);
}

useEffect(() => {
	dispatchForm({ type: 'SET_VALUE', payload: { userId }});
}, [userId]);

//ограничение контекста - контектс не замена props, не следует использовать для соседних компонент (нет смысла),не оптимизирован для частых изменений


//---------------------
//Как работает React (Работа React)
//react не работает с DOM на прямую, для работы с dom есть react dom который напрямую работает с dom. тоесть react рабоатет с компонентами а react dom работает с DOM. C помощью virtual Dom - некоторое представления DOM в памяти и т.к. оно находиться в памяти мы можем с ним проделывать быстрые операции.
//Когда у компонента меняеться состояние -> компонент говорит что он изменился -> дальше обращаеться к virtual Dom и react строит разницу между текущим и новым состоянием, и в нужном месте меняем состояние, за счет того что virtual Dom быстрый и мы быстро получаем разницу -> далее это разница прокидываеться в react dom -> далее react dom отпровляет в оригинальный DOM.

//-------------------
//Memo
//кэширует пропсы и каждый при перерысовке если ничего не изменилось он не меняет состояние и не перерисовываеться. Используем когда у нас очень длинная цепочка (3-4 компоненты в цепочке). !Важно если используеться в качестве props функция Memo работать не будет т.к. функция это объект и сравнение двух объектов дадут false т.к. разные указатели на объект.Тоесть Memo работает на примитивных типах.

import { memo } from 'react';

function Logo({ image }) {
	console.log('Logo');

	return <img className={styles.logo} src={image} alt="Логотип журнала" />;
}

export default memo(Logo);

//-------------------
//useCallback
//Для запоминие некоторой функции, ее кэширование используем useCallback. 

import { useCallback, useState } from 'react';
import Button from '../Button/Button';
import SelectUser from '../SelectUser/SelectUser';
import Logo from '../Logo/Logo';

const logos = ['/logo.svg', '/vite.svg'];

function Header() {
	const [logoIndex, setLogoIndex] = useState(0);
	console.log('Header');

  ///useCallback 
	const toggleLogo = useCallback(() => {
		setLogoIndex(state => Number(!state));
	}, []);//[] - набор дополнительных зависемостей

	return (
		<>
			<Logo image={logos[0]} />
			<SelectUser />
			<Button onClick={toggleLogo}>Сменить лого</Button>
		</>
	);
}

import { memo } from 'react';

function Button({ children, onClick }) {
	console.log('Button');
	return (
		<button className='button accent' onClick={onClick}>{children}</button>
	);
}

//-------------------
//Планировщик state
//В react есть планировщик состояние, меняет состояние по приоритету определеная очередь, разница в доли секунды. Для распределения нагруки и времени. 

//----------------
//Batching
//Механизм react для оптимизации обновления состояние, может некоторые состояние менять одновременно

//-----------------
//useMemo
//позволяет кэшировать рачет переменной или значения, для тяжелых расчетах, на маленьких данных эффективность особо не заметим

import { useContext, useMemo } from 'react';

function JournalList({ items }) {
  //....
  const filteredItems = useMemo(() => items
		.filter(el => el.userId === userId)
		.sort(sortItems), [items, userId]); //[] - зависемости то что используем в расчетах
}

