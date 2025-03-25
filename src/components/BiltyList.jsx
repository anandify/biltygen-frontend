// src/components/BiltyList.jsx
import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Card } from 'react-bootstrap';
import api from '../services/api';

const BiltyList = () => {
  const [bilties, setBilties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBilties = async () => {
      try {
        setLoading(true);
        const response = await api.getBilties();
        setBilties(response.data._embedded.bilties);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bilties');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBilties();
  }, []);

  const viewBilty = (id) => {
    // Navigate to bilty detail view
    console.log('View bilty with ID:', id);
  };

  const printBilty = (id) => {
    // Navigate to print view
    console.log('Print bilty with ID:', id);
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-secondary text-white text-center py-3">
          <h2 className="mb-0">All Bilties</h2>
        </Card.Header>
        <Card.Body>
          {bilties.length === 0 ? (
            <p className="text-center">No bilties found</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Bilty No</th>
                  <th>Consignor</th>
                  <th>Consignee</th>
                  <th>Driver</th>
                  <th>Weight</th>
                  <th>Total</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bilties.map(bilty => (
                  <tr key={bilty.id}>
                    <td>{bilty.biltyNo}</td>
                    <td>{bilty.consignor ? bilty.consignor.name : 'N/A'}</td>
                    <td>{bilty.consignee ? bilty.consignee.name : 'N/A'}</td>
                    <td>{bilty.driver ? bilty.driver.name : 'N/A'}</td>
                    <td>{bilty.weight}</td>
                    <td>{bilty.total}</td>
                    <td>{new Date(bilty.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => viewBilty(bilty.id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => printBilty(bilty.id)}
                      >
                        Print
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BiltyList;
