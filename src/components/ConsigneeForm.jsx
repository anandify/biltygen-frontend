// src/components/ConsigneeForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Table, Container } from 'react-bootstrap';
import api from '../services/api';

const ConsigneeForm = () => {
  const [consignees, setConsignees] = useState([]);
  const [newConsignee, setNewConsignee] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConsignees = async () => {
      try {
        const response = await api.getConsignees();
        setConsignees(response.data._embedded.consignees);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch consignees');
        setLoading(false);
      }
    };
    fetchConsignees();
  }, []);

  const handleChange = (e) => {
    setNewConsignee({
      ...newConsignee,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createConsignee(newConsignee);
      setConsignees([...consignees, response.data]);
      setNewConsignee({ name: '', address: '', phone: '' });
    } catch (err) {
      setError('Failed to create consignee');
    }
  };

  if (loading) return <div className="text-center my-3"><div className="spinner-border" role="status"></div></div>;

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-success text-white">
        <h4 className="mb-0">Manage Consignees</h4>
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
                  value={newConsignee.name}
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
                  value={newConsignee.phone}
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
                  value={newConsignee.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="text-end">
            <Button variant="success" type="submit">
              Add Consignee
            </Button>
          </div>
        </Form>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="mt-4">
          <h5>Existing Consignees</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {consignees.map(consignee => (
                <tr key={consignee.id}>
                  <td>{consignee.name}</td>
                  <td>{consignee.phone}</td>
                  <td>{consignee.address}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ConsigneeForm;
