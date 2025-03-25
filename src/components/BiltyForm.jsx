// src/components/BiltyForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import api from '../services/api';

const BiltyForm = () => {
  const [bilty, setBilty] = useState({
    biltyNo: '',
    consignor: null,
    consignee: null,
    driver: null,
    particulars: '',
    weight: 0,
    freight: 0,
    tax: 0,
    total: 0
  });

  const [consignors, setConsignors] = useState([]);
  const [consignees, setConsignees] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewConsignor, setShowNewConsignor] = useState(false);
  const [showNewConsignee, setShowNewConsignee] = useState(false);
  const [showNewDriver, setShowNewDriver] = useState(false);
  const [newConsignor, setNewConsignor] = useState({ name: '', address: '', phone: '' });
  const [newConsignee, setNewConsignee] = useState({ name: '', address: '', phone: '' });
  const [newDriver, setNewDriver] = useState({ name: '', licenseNumber: '', phone: '', address: '' });

  useEffect(() => {
    const freight = parseFloat(bilty.freight) || 0;
    const tax = parseFloat(bilty.tax) || 0;
    setBilty(prev => ({
      ...prev,
      total: freight + tax
    }));
  }, [bilty.freight, bilty.tax]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [consignorsRes, consigneesRes, driversRes] = await Promise.all([
          api.getConsignors(),
          api.getConsignees(),
          api.getDrivers()
        ]);
        
        setConsignors(consignorsRes.data._embedded.consignors);
        setConsignees(consigneesRes.data._embedded.consignees);
        setDrivers(driversRes.data._embedded.drivers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBilty(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e, type) => {
    const value = e.target.value;
    
    if (value === "new") {
      if (type === 'consignor') setShowNewConsignor(true);
      if (type === 'consignee') setShowNewConsignee(true);
      if (type === 'driver') setShowNewDriver(true);
      setBilty(prev => ({ ...prev, [type]: null }));
      return;
    }
    
    if (value === "") {
      setBilty(prev => ({ ...prev, [type]: null }));
      return;
    }

    const selectedId = parseInt(value);
    let selectedItem;

    switch (type) {
      case 'consignor':
        selectedItem = consignors.find(c => c.id === selectedId);
        break;
      case 'consignee':
        selectedItem = consignees.find(c => c.id === selectedId);
        break;
      case 'driver':
        selectedItem = drivers.find(d => d.id === selectedId);
        break;
      default:
        selectedItem = null;
    }

    setBilty(prev => ({ ...prev, [type]: selectedItem }));
  };

  const handleNewEntityChange = (e, type) => {
    const { name, value } = e.target;
    const setters = {
      consignor: setNewConsignor,
      consignee: setNewConsignee,
      driver: setNewDriver
    };
    setters[type](prev => ({ ...prev, [name]: value }));
  };

  const addNewEntity = async (type) => {
    try {
      let response;
      const creators = {
        consignor: api.createConsignor,
        consignee: api.createConsignee,
        driver: api.createDriver
      };
      
      const data = {
        consignor: newConsignor,
        consignee: newConsignee,
        driver: newDriver
      }[type];

      response = await creators[type](data);
      
      const updaters = {
        consignor: setConsignors,
        consignee: setConsignees,
        driver: setDrivers
      };
      updaters[type](prev => [...prev, response.data]);
      
      setBilty(prev => ({ ...prev, [type]: response.data }));
      setShowNewConsignor(false);
      setShowNewConsignee(false);
      setShowNewDriver(false);
      
    } catch (err) {
      setError(`Failed to create ${type}`);
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createBilty(bilty);
      alert('Bilty created successfully!');
      // Reset form
      setBilty({
        biltyNo: '',
        consignor: null,
        consignee: null,
        driver: null,
        particulars: '',
        weight: 0,
        freight: 0,
        tax: 0,
        total: 0
      });
    } catch (err) {
      setError('Failed to create bilty');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <Container className="my-4">
      <Card className="shadow-sm bilty-form">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h2 className="mb-0">BHARAT BILTY GENERATOR</h2>
          <p className="mb-0">Create New Goods Consignment Note</p>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label><strong>Bilty No</strong></Form.Label>
                  <Form.Control
                    type="text"
                    name="biltyNo"
                    value={bilty.biltyNo}
                    onChange={handleChange}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label><strong>Date</strong></Form.Label>
                  <Form.Control
                    type="text"
                    value={new Date().toLocaleDateString()}
                    readOnly
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Consignor Section */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h4 className="mb-0">Consignor (Sender) Details</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Select Consignor</strong></Form.Label>
                  <Form.Select
                    name="consignor"
                    onChange={(e) => handleSelectChange(e, 'consignor')}
                    required
                    className="mb-2"
                  >
                    <option value="">Select Consignor</option>
                    {consignors.map(consignor => (
                      <option key={consignor.id} value={consignor.id}>
                        {consignor.name}
                      </option>
                    ))}
                    <option value="new">+ Add New Consignor</option>
                  </Form.Select>
                </Form.Group>
                
                {showNewConsignor && (
                  <div className="p-3 border rounded">
                    <h5>Add New Consignor</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={newConsignor.name}
                            onChange={(e) => handleNewEntityChange(e, 'consignor')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={newConsignor.phone}
                            onChange={(e) => handleNewEntityChange(e, 'consignor')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            name="address"
                            value={newConsignor.address}
                            onChange={(e) => handleNewEntityChange(e, 'consignor')}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button variant="secondary" className="me-2" onClick={() => setShowNewConsignor(false)}>
                        Cancel
                      </Button>
                      <Button variant="success" onClick={() => addNewEntity('consignor')}>
                        Add Consignor
                      </Button>
                    </div>
                  </div>
                )}

                {bilty.consignor && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <p className="mb-1"><strong>Name:</strong> {bilty.consignor.name}</p>
                    <p className="mb-1"><strong>Phone:</strong> {bilty.consignor.phone}</p>
                    <p className="mb-0"><strong>Address:</strong> {bilty.consignor.address}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Consignee Section */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h4 className="mb-0">Consignee (Receiver) Details</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Select Consignee</strong></Form.Label>
                  <Form.Select
                    name="consignee"
                    onChange={(e) => handleSelectChange(e, 'consignee')}
                    required
                    className="mb-2"
                  >
                    <option value="">Select Consignee</option>
                    {consignees.map(consignee => (
                      <option key={consignee.id} value={consignee.id}>
                        {consignee.name}
                      </option>
                    ))}
                    <option value="new">+ Add New Consignee</option>
                  </Form.Select>
                </Form.Group>
                
                {showNewConsignee && (
                  <div className="p-3 border rounded">
                    <h5>Add New Consignee</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={newConsignee.name}
                            onChange={(e) => handleNewEntityChange(e, 'consignee')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={newConsignee.phone}
                            onChange={(e) => handleNewEntityChange(e, 'consignee')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            name="address"
                            value={newConsignee.address}
                            onChange={(e) => handleNewEntityChange(e, 'consignee')}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button variant="secondary" className="me-2" onClick={() => setShowNewConsignee(false)}>
                        Cancel
                      </Button>
                      <Button variant="success" onClick={() => addNewEntity('consignee')}>
                        Add Consignee
                      </Button>
                    </div>
                  </div>
                )}

                {bilty.consignee && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <p className="mb-1"><strong>Name:</strong> {bilty.consignee.name}</p>
                    <p className="mb-1"><strong>Phone:</strong> {bilty.consignee.phone}</p>
                    <p className="mb-0"><strong>Address:</strong> {bilty.consignee.address}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Driver Section */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h4 className="mb-0">Driver Details</h4>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Select Driver</strong></Form.Label>
                  <Form.Select
                    name="driver"
                    onChange={(e) => handleSelectChange(e, 'driver')}
                    required
                    className="mb-2"
                  >
                    <option value="">Select Driver</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                    <option value="new">+ Add New Driver</option>
                  </Form.Select>
                </Form.Group>
                
                {showNewDriver && (
                  <div className="p-3 border rounded">
                    <h5>Add New Driver</h5>
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={newDriver.name}
                            onChange={(e) => handleNewEntityChange(e, 'driver')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>License No.</Form.Label>
                          <Form.Control
                            type="text"
                            name="licenseNumber"
                            value={newDriver.licenseNumber}
                            onChange={(e) => handleNewEntityChange(e, 'driver')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={newDriver.phone}
                            onChange={(e) => handleNewEntityChange(e, 'driver')}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={1}
                            name="address"
                            value={newDriver.address}
                            onChange={(e) => handleNewEntityChange(e, 'driver')}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end">
                      <Button variant="secondary" className="me-2" onClick={() => setShowNewDriver(false)}>
                        Cancel
                      </Button>
                      <Button variant="success" onClick={() => addNewEntity('driver')}>
                        Add Driver
                      </Button>
                    </div>
                  </div>
                )}

                {bilty.driver && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <p className="mb-1"><strong>Name:</strong> {bilty.driver.name}</p>
                    <p className="mb-1"><strong>License:</strong> {bilty.driver.licenseNumber}</p>
                    <p className="mb-1"><strong>Phone:</strong> {bilty.driver.phone}</p>
                    <p className="mb-0"><strong>Address:</strong> {bilty.driver.address}</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Goods Details Section */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h4 className="mb-0">Goods Details</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Particulars</strong></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="particulars"
                        value={bilty.particulars}
                        onChange={handleChange}
                        required
                        placeholder="Describe the goods being transported"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Weight (kg)</strong></Form.Label>
                      <Form.Control
                        type="number"
                        name="weight"
                        value={bilty.weight}
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Charges Section */}
            <Card className="mb-4">
              <Card.Header className="bg-light">
                <h4 className="mb-0">Charges</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Freight (₹)</strong></Form.Label>
                      <Form.Control
                        type="number"
                        name="freight"
                        value={bilty.freight}
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Tax (₹)</strong></Form.Label>
                      <Form.Control
                        type="number"
                        name="tax"
                        value={bilty.tax}
                        onChange={handleChange}
                        step="0.01"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Total (₹)</strong></Form.Label>
                      <Form.Control
                        type="number"
                        value={bilty.total}
                        readOnly
                        className="fw-bold"
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" size="lg" className="px-5">
                Generate Bilty
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BiltyForm;
