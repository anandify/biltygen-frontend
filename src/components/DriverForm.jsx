// src/components/DriverForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Container } from 'react-bootstrap';
import api from '../services/api';

const DriverForm = () => {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState({
    name: '',
    licenseNumber: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.getDrivers();
        setDrivers(response.data._embedded.drivers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch drivers');
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setNewDriver({
      ...newDriver,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createDriver(newDriver);
      setDrivers([...drivers, response.data]);
      setNewDriver({ name: '', licenseNumber: '', phone: '', address: '' });
    } catch (err) {
      setError('Failed to create driver');
    }
  };

  if (loading) return <div className="text-center my-3"><div className="spinner-border" role="status"></div></div>;

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-warning text-dark">
        <h4 className="mb-0">Manage Drivers</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newDriver.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>License No.</Form.Label>
                <Form.Control
                  type="text"
                  name="licenseNumber"
                  value={newDriver.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={newDriver.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  name="address"
                  value={newDriver.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="text-end">
            <Button variant="warning" type="submit">
              Add Driver
            </Button>
          </div>
        </Form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mt-4">
          <h5>Existing Drivers</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>License No.</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id}>
                  <td>{driver.name}</td>
                  <td>{driver.licenseNumber}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.address}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DriverForm;
