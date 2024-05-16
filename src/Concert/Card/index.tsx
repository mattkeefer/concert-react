import {useNavigate} from "react-router";
import "./index.css";

export default function ConcertCard({cardDetails}: {
  cardDetails: {
    concertId: string,
    title: string,
    venue: string,
    city: string,
    date: Date,
    image: string,
  }
}) {

  const navigate = useNavigate();
  const [source, id] = cardDetails.concertId.split(":");

  return (
      <button className="btn p-0 rounded-4 text-start my-2"
              onClick={() => navigate(`/Concert/${source}/${id}`)}>
        <div className="card rounded-4" style={{width: "14rem"}}>
          <img src={cardDetails.image} className="card-img-top rounded-top-4"
               style={{height: "14rem", objectFit: "cover"}} alt={cardDetails.title}/>
          <div className="card-body">
            <h5 className="card-title text-nowrap text-truncate">{cardDetails.title}</h5>
            <ul className="list-group list-group-flush list-unstyled">
              <li className="card-text">{cardDetails.date.toDateString().slice(0, -5)}</li>
              <li className="card-text text-nowrap text-truncate">{cardDetails.venue}</li>
              <li className="card-text card-text-accent">{cardDetails.city}</li>
            </ul>
          </div>
        </div>
      </button>

  )
}