// src/components/ConsignorForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Container } from 'react-bootstrap';
import api from '../services/api';

const ConsignorForm = () => {
  const [consignors, setConsignors] = useState([]);
  const [newConsignor, setNewConsignor] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConsignors = async () => {
      try {
        const response = await api.getConsignors();
        setConsignors(response.data._embedded.consignors);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch consignors');
        setLoading(false);
      }
    };
    fetchConsignors();
  }, []);

  const handleChange = (e) => {
    setNewConsignor({
      ...newConsignor,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createConsignor(newConsignor);
      setConsignors([...consignors, response.data]);
      setNewConsignor({ name: '', address: '', phone: '' });
    } catch (err) {
      setError('Failed to create consignor');
    }
  };

  if (loading) return <div className="text-center my-3"><div className="spinner-border" role="status"></div></div>;

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">Manage Consignors</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={newConsignor.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={newConsignor.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  name="address"
                  value={newConsignor.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="text-end">
            <Button variant="primary" type="submit">
              Add Consignor
            </Button>
          </div>
        </Form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mt-4">
          <h5>Existing Consignors</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {consignors.map(consignor => (
                <tr key={consignor.id}>
                  <td>{consignor.name}</td>
                  <td>{consignor.phone}</td>
                  <td>{consignor.address}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ConsignorForm;
