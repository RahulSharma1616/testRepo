import { BsFillCalendarCheckFill } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { FaTicketSimple } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BsFillHousesFill } from "react-icons/bs";
import { LuMailPlus } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function SideNav() {
  const [cookies] = useCookies(["token"]);
  const [manager, setManager] = useState(false);

  useEffect(() => {
    axios({
      method: "get",

      url: "http://localhost:4000/user/isManager",

      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      setManager(response.data.manager);
    });
  }, []);

  return (
      <div className="side-nav">
        <div className="">
          <ul className="px-3">
            <Link className="text-decoration-none text-white" to="/">
              <li className="my-4 text-center">
                <AiFillHome size={24} /> <div className="">Home</div>
              </li>
            </Link>

            <Link
              to="/create-timesheet"
              className="text-decoration-none text-white"
            >
              {" "}
              <li className="my-3 text-center">
                <BsFillCalendarCheckFill size={24} />{" "}
                <div className="">Create Timesheet</div>{" "}
              </li>
            </Link>

            <Link to="/tickets" className="text-decoration-none text-white">
              <li className="my-3 text-center">
                <FaTicketSimple size={24} /> <div>Tickets</div>{" "}
              </li>
            </Link>

            {manager && (
              <div>

                <hr style={{ margin: "10px" }} />

                <Link
                  to="/manager-dashboard"
                  className="text-decoration-none text-white"
                >
                  <li className="my-6 text-center mb-4">
                    <BsFillHousesFill size={24} /> <div>Manager's Desk</div>{" "}
                  </li>
                </Link>
                <Link
                  to="/tickets-received"
                  className="text-decoration-none text-white"
                >
                  <li className="my-6 text-center">
                    <LuMailPlus size={24} /> <div>Tickets Received</div>{" "}
                  </li>
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
  );
}
