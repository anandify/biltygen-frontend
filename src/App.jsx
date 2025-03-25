// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

// Import components
import BiltyForm from './components/BiltyForm';
import BiltyList from './components/BiltyList';
import ConsignorForm from './components/ConsignorForm';
import ConsigneeForm from './components/ConsigneeForm';
import DriverForm from './components/DriverForm';
import BiltyPrintView from './components/BiltyPrintView';

const MainNavbar = () => (
  <Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/">Bharat Bilty Generator</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/bilties">View Bilties</Nav.Link>
          <Nav.Link as={Link} to="/create-bilty">Create Bilty</Nav.Link>
          <Nav.Link as={Link} to="/manage-data">Manage Data</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

const ManageDataPage = () => (
  <Container>
    <h2 className="text-center my-4">Manage Master Data</h2>
    <div className="row">
      <div className="col-md-4">
        <ConsignorForm />
      </div>
      <div className="col-md-4">
        <ConsigneeForm />
      </div>
      <div className="col-md-4">
        <DriverForm />
      </div>
    </div>
  </Container>
);

const HomePage = () => (
  <Container className="text-center my-5">
    <h1>Welcome to Bharat Bilty Generator</h1>
    <p className="lead">Create and manage your bilties with ease</p>
    <div className="mt-4">
      <Link to="/create-bilty" className="btn btn-primary btn-lg me-3">Create New Bilty</Link>
      <Link to="/bilties" className="btn btn-secondary btn-lg">View All Bilties</Link>
    </div>
  </Container>
);

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <MainNavbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bilties" element={<BiltyList />} />
            <Route path="/create-bilty" element={<BiltyForm />} />
            <Route path="/manage-data" element={<ManageDataPage />} />
            <Route path="/bilty/:id" element={<BiltyPrintView />} />
          </Routes>
        </div>
        <footer className="bg-dark text-white py-3 mt-5">
          <Container className="text-center">
            <p className="mb-0">© {new Date().getFullYear()} Bharat Bilty Generator</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
