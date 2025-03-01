import "./index.css";

export default function SimpleList({listItems}: {
  listItems: { name: string, image?: string }[]
}) {
  return (
      <ul className={listItems.length > 7 ?
          "list-group list-group-flush list-unstyled simple-list" :
          "list-group list-group-flush list-unstyled"}>
        {listItems.map((item, i) => <li
            className="list-group-item concert-info-list-item rounded mb-2"
            key={item.name + i}>
          <div className="rounded-5 d-flex justify-content-between align-items-center">
            {item.name}
            <img src={item.image} alt={item.name} className="rounded-5 concert-img-icon"/>
          </div>
        </li>)}
      </ul>
  );
}