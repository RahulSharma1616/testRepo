import SideNav from "./SideNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Navbar from "./Navbar";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { MdInfoOutline } from "react-icons/md";

export default function Projects() {
  const [isLoading, setIsLoading] = useState(true);
  const [cookies] = useCookies(["token"]);
  const [modalShow, setModalShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({});
  const [resources, setResources] = useState([]);
  const [render, setRender] = useState(0);
  let email = "";
  let hours;
  //state for the from date(billable)
  const [fromDate, setFromDate] = useState("");

  let [message, setMessage] = useState(""); // State variable for managing a message

  // This state variable manages the visibility of the toast.
  const [showToast, setShowToast] = useState(false);

  // This function is responsible for toggling the state of the showToast variable.
  const toggleShowToast = () => setShowToast(!showToast);

  function MydModalWithGrid(props) {
    return (
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedProject.projectName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="grid-example">
          <Container>
            <Row className="mb-2">
              <Col className="d-flex flex-column align-items-center">
                {selectedProject.managerImage && (
                  <img
                    className="modal-icon rounded-circle mb-3"
                    src={selectedProject.managerImage.url}
                    alt=""
                  />
                )}
                <p className="text-center mb-0">
                  <strong>Project Manager</strong>
                </p>
                {selectedProject.managerImage && (
                  <p className="text-center">{selectedProject.managerName}</p>
                )}
              </Col>
            </Row>
            <div className="teamMember">
              {resources[0] &&
                resources.map((resource) => {
                  return (
                    <Row key={resource._id} className="my-2">
                      <Col xs={6} md={2}>
                        <img
                          className="modal-icon rounded-circle"
                          src={resource.image.url}
                          alt=""
                        />
                      </Col>
                      <Col xs={6} md={6}>
                        <h6 className="mb-1">{resource.name}</h6>
                        <p>{resource.designation}</p>
                      </Col>
                      <Col xs={6} md={4}>
                        <button
                          onClick={() => onRemove(resource)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Remove
                        </button>
                      </Col>
                    </Row>
                  );
                })}
              {resources.length == 0 && (
                <div className="d-flex justify-content-center">
                  No Resources Added
                </div>
              )}
            </div>
            <Row>
              <h5 className="my-2 px-1">Add Resource</h5>
              <input
                onChange={(e) => (email = e.target.value)}
                type="email"
                className="form-control mb-2 px-2"
                placeholder="Enter Email Address"
                required
              />
              <input
                type="number"
                onChange={(e) => (hours = e.target.value)}
                className="form-control mb-2 px-2"
                placeholder="Enter Expected Hours"
                required
              />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setFromDate(e.target.value);
                }}
              />
              <div className="d-flex justify-content-end px-1">
                <button onClick={onAdd} className="btn btn-outline-primary">
                  Add
                </button>
              </div>
            </Row>
          </Container>
        </Modal.Body>
        <Toast
          show={showToast}
          delay={5000}
          autohide
          onClose={toggleShowToast}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Toast.Body className="bg-success text-white">
            <strong>
              <MdInfoOutline size={25} /> {message}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white float-end"
              onClick={toggleShowToast}
            ></button>
          </Toast.Body>
        </Toast>
      </Modal>
    );
  }

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:4000/project/all",
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then(
      function (response) {
        setProjects(response.data);
        setIsLoading(false);
      },
      function (error) {
        console.log("error: ", error);
        setIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:4000/project/resources",
      data: {
        projectID: selectedProject._id,
      },
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then(
      function (response) {
        setResources(response.data);
        setIsLoading(false);
      },
      function (error) {
        console.log("error: ", error);
        setIsLoading(false);
      }
    );
  }, [selectedProject, render]);

  function onRemove(resource) {
    axios({
      method: "delete",
      url: `http://localhost:4000/project/resources/${resource._id}`,
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      setMessage(response.data.message);
      setShowToast(true);
      setRender(render + 1);
    });
  }

  function onAdd() {
    // console.log(email, fromDate, hours);
    axios({
      method: "post",
      url: `http://localhost:4000/project/add/${email}`,
      data: {
        projectID: selectedProject._id,
        expectedHours: hours,
        fromDate: fromDate,
      },
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((response) => {
      setMessage(response.data.message);
      setShowToast(true);
      setRender(render + 1);
    });
  }

  return (
    <>
      <Navbar />
      {isLoading && (
        <div className="loader-overlay">
          <div className="bouncing-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-1 mt-6">
          <SideNav />
        </div>
        <div className="col-lg-11 mt-6">
          <div className="table-container">
            <div className="timesheet-header d-flex justify-content-between">
              <h3
                className="h2 m-2"
                style={{ fontWeight: "350", verticalAlign: "middle" }}
              >
                Projects
              </h3>
            </div>
            <div className="row m-4">
              {projects.map((project) => {
                return (
                  <div
                    key={project._id}
                    onClick={() => {
                      setSelectedProject(project);
                      setModalShow(true);
                    }}
                    className="col-lg-4"
                  >
                    <div className="project-card1 clickable-cell shadow-lg text-center mb-4">
                      <h3 className="projectHeading ">{project.projectName}</h3>
                      <h3 className="projectSubheading">{project.id}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
