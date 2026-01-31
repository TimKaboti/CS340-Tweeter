import { Link } from "react-router-dom";
import { Status } from "tweeter-shared";
import Post from "./Post";

interface Props {
  status: Status;

  /** where the alias link should go, e.g. `/feed/@bob` or `/story/@bob` */
  linkTo: string;

  /** used by Post.tsx (your Post requires it) */
  featurePath: string;

  /** your existing navigateToUser handler from the scroller */
  onNavigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const StatusItem = ({ status, linkTo, featurePath, onNavigateToUser }: Props) => {
  return (
    <div className="row mb-3 mx-0 px-0 border rounded bg-white">
      <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={status.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>

            <div className="col">
              <h2>
                <b>
                  {status.user.firstName} {status.user.lastName}
                </b>{" "}
                -{" "}
                <Link to={linkTo} onClick={onNavigateToUser}>
                  {status.user.alias}
                </Link>
              </h2>

              {status.formattedDate}
              <br />

              <Post status={status} featurePath={featurePath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
