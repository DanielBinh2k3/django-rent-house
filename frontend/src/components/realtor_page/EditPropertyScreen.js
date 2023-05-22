import React, { useState } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';

const EditPropertyScreen = ({ showModal, handleClose }) => {
  const [propertyData, setPropertyData] = useState({
    title: '',
    address: '',
    city: '',
    district: '',
    zipcode: '',
    description: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle form submission and update property details
    console.log(propertyData);
  };

  return (
    <Modal size="lg" show={showModal} onHide={handleClose} centered scrollable >
      <Modal.Header closeButton>
        <Modal.Title>Edit Property</Modal.Title>
      </Modal.Header>
      <Modal.Body >
        <Form onSubmit={handleSubmit} style={{marginBottom: '3rem'}}>
          <Form.Group controlId="title">
            <Form.Control
              type="text"
              name="title"
              value={propertyData.title}
              placeholder='Title'
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Control
              type="text"
              name="address"
              value={propertyData.address}
              placeholder='Address'
              onChange={handleChange}
            />
          </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="city">
              <Form.Control
                type="text"
                name="city"
                value={propertyData.city}
                placeholder='city'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="district">
              <Form.Control
                type="text"
                name="district"
                value={propertyData.district}
                placeholder='district'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="zipcode">
              <Form.Control
                type="text"
                name="zipcode"
                value={propertyData.zipcode}
                placeholder='zipcode'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="price">
              <Form.Control
                type="text"
                name="price"
                value={propertyData.price}
                placeholder='price'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="area">
              <Form.Control
                type="text"
                name="area"
                value={propertyData.area}
                placeholder='area'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="bedrooms">
              <Form.Control
                type="text"
                name="bedrooms"
                value={propertyData.bedrooms}
                placeholder='bedrooms'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="bathrooms">
              <Form.Control
                type="text"
                name="bathrooms"
                value={propertyData.bathrooms}
                placeholder='bathrooms'
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
            <Form.Group controlId="image">
              <Form.Control
                type="text"
                name="image"
                value={propertyData.image}
                placeholder='image'
                onChange={handleChange}
              />
            </Form.Group>
        </Row>
          {/* Add form fields for other property details */}

          </Form>
        </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        
      
    </Modal>
  );
};

export default EditPropertyScreen;
