// src/components/BiltyPrintView.jsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const BiltyPrintView = ({ bilty }) => {
  if (!bilty) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-end mb-3 no-print">
        <Button variant="primary" onClick={handlePrint}>
          Print Bilty
        </Button>
      </div>

      <div className="bilty-display">
        <div className="bilty-header">
          <h1 className="bilty-title">BHARAT BILTY</h1>
          <p>Goods Consignment Note</p>
          <h2>Bilty No: {bilty.biltyNo}</h2>
          <p>Date: {new Date(bilty.createdAt).toLocaleDateString()}</p>
        </div>

        <Row>
          <Col md={6} className="bilty-section">
            <h4>Consignor Details:</h4>
            <p>
              <strong>Name:</strong> {bilty.consignor?.name}<br />
              <strong>Address:</strong> {bilty.consignor?.address}<br />
              <strong>Phone:</strong> {bilty.consignor?.phone}
            </p>
          </Col>
          <Col md={6} className="bilty-section">
            <h4>Consignee Details:</h4>
            <p>
              <strong>Name:</strong> {bilty.consignee?.name}<br />
              <strong>Address:</strong> {bilty.consignee?.address}<br />
              <strong>Phone:</strong> {bilty.consignee?.phone}
            </p>
          </Col>
        </Row>

        <div className="bilty-section">
          <h4>Driver Details:</h4>
          <p>
            <strong>Name:</strong> {bilty.driver?.name}<br />
            <strong>License:</strong> {bilty.driver?.licenseNumber}<br />
            <strong>Phone:</strong> {bilty.driver?.phone}
          </p>
        </div>

        <div className="bilty-section">
          <h4>Goods Details:</h4>
          <p>
            <strong>Particulars:</strong> {bilty.particulars}<br />
            <strong>Weight:</strong> {bilty.weight} kg
          </p>
        </div>

        <div className="bilty-section">
          <h4>Charges:</h4>
          <p>
            <strong>Freight:</strong> ₹{bilty.freight}<br />
            <strong>Tax:</strong> ₹{bilty.tax}<br />
            <strong>Total:</strong> ₹{bilty.total}
          </p>
        </div>

        <div className="bilty-footer">
          <div className="signature-box">
            Consignor's Signature
          </div>
          <div className="signature-box">
            Driver's Signature
          </div>
          <div className="signature-box">
            Consignee's Signature
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BiltyPrintView;
