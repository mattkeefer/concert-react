import ConcertCard from "../Card";
import {Concert} from "../../Clients/Schemas/concerts";
import "./index.css";

export default function SimpleDisplay({concerts}: { concerts: Concert[] }) {
  return (
      <div className="card-group">
        <ul className="list-group list-group-horizontal">
          {concerts.map((concert, i) => (
                  <li key={'event' + i}>
                    <ConcertCard concert={concert}/>
                  </li>
              )
          )}
        </ul>
      </div>
  );
}