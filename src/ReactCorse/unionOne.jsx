//компоненты - переиспользуемость, разделения ответсвености, компонент это функция в новой версии (ранее были функциональные компоненты)

//jsx - аналог который описывает нашу разметку, синтаксический сахар

//функцию оборачиваем в коревой элемент в внутрь ложим остальные элементы <></>

//Декларативное описание нашего кода

//Компонент
export const Btn = () => {
  return (
    <>
      <button>Сохранить</button>
    </>
  );
};

//Стилизация
function Btn() {
  return <button className="button accent">Сохранить</button>;
}

/* .accent {
	background: #312EB5;
} */

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

//