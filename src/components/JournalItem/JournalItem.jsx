import './JournalItem.css';


export const JournalItem = ({ title, text, date }) => {
  const format = new Intl.DateTimeFormat('ru-Ru').format(date);

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


