import {useNavigate} from "react-router";
import "./index.css";
import {Concert} from "../../Clients/concertClient";

export default function ConcertCard({concert}: { concert: Concert }) {

  const navigate = useNavigate();
  concert = {...concert, startDate: new Date(concert.startDate)};

  return (
      <button className="btn p-0 rounded-4 text-start my-2"
              onClick={() => navigate(`/Concert/${concert._id}`)}>
        <div className="card rounded-4" style={{width: "14rem"}}>
          <img src={concert.image} className="card-img-top rounded-top-4"
               style={{height: "14rem", objectFit: "cover"}} alt={concert.title}/>
          <div className="card-body">
            <h5 className="card-title text-nowrap text-truncate">{concert.title}</h5>
            <ul className="list-group list-group-flush list-unstyled">
              <li className="card-text">{concert.startDate.toDateString().slice(0, -5)} &#8226; {
                concert.startDate.toLocaleTimeString().split(":")[0]}:{
                concert.startDate.toLocaleTimeString().split(":")[1]} PM
              </li>
              <li className="card-text text-nowrap text-truncate">{concert.venue.name}</li>
              <li className="card-text card-text-accent text-nowrap text-truncate">{concert.venue.city}</li>
            </ul>
          </div>
        </div>
      </button>
  );
}