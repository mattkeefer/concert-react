import {useNavigate} from "react-router";
import "./index.css";
import {Concert} from "../../Clients/Schemas/concerts";
import {findOrCreateConcert} from "../../Clients/concertClient";
import {Badge} from "react-bootstrap";

export default function ConcertCard({concert}: { concert: Concert }) {

  const navigate = useNavigate();
  concert = {...concert, startDate: new Date(concert.startDate)};
  const isDiscoveryConcert = concert._id === concert.discoveryId;

  const handleClick = async () => {
    if (isDiscoveryConcert) {
      // Discovery concert, need to find or create saved concert
      const newConcert = await findOrCreateConcert(concert);
      navigate(`/Concert/${newConcert._id}`);
    } else {
      // Saved concert
      navigate(`/Concert/${concert._id}`);
    }
  }

  return (
      <button className="btn p-0 rounded-4 text-start my-2"
              onClick={handleClick}>
        <div className="card rounded-4" style={{width: "14rem"}}>
          <div className="card-image-container">
            <img src={concert.image} className="card-img-top rounded-top-4"
                 style={{height: "14rem", objectFit: "cover"}} alt={concert.title}/>
            {!isDiscoveryConcert && <Badge className="position-absolute m-2 top-0 start-0 rounded"
                                           bg="black">{concert.attendingUsers.length} attending</Badge>}
          </div>
          <div className="card-body">
            <h5 className="card-title text-nowrap text-truncate">{concert.title}</h5>
            <ul className="list-group list-group-flush list-unstyled">
              <li className="card-text">{concert.startDate.toDateString().slice(0, -5)} &#8226; {
                concert.startDate.toLocaleTimeString().split(":")[0]}:{
                concert.startDate.toLocaleTimeString().split(":")[1]} PM
              </li>
              <li className="card-text text-nowrap text-truncate">{concert.venue.name}</li>
              <li className="card-text card-text-accent text-nowrap text-truncate">
                {concert.venue.city}, {concert.venue.country}
              </li>
            </ul>
          </div>
        </div>
      </button>
  );
}