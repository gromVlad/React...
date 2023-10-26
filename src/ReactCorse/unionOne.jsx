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
