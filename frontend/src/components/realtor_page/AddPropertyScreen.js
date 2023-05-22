import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import FormContainer from "../common/FormContainer";

// const FormContainer = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
// `;

// const StepIndicator = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-bottom: 20px;
// `;


const AddPropertyScreen = () => {
  const [step, setStep] = useState(1);
  const [home_type, setHomeType] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [main_photo, setMainPhoto] = useState("");
  const [is_published, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const handleNextStep = (event) => {
    event.preventDefault();
    setStep(step + 1);
  };

  const handlePreviousStep = (event) => {
    event.preventDefault();
    setStep(step - 1);
  };

  const uploadFileHandler = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMainPhoto(data.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          home_type,
          address,
          city,
          zipcode,
          area,
          price,
          bedrooms,
          bathrooms,
          title,
          description,
          main_photo,
          is_published,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
        {step === 1 && (
          <FormContainer onSubmit={handleNextStep}>
            <Form className="card bg-light" style={{height: '500px'}}>
              <div>
                <h3>Home Type</h3>
                <div className="steps-indicator flex">
                  <div className="step active">Step 1</div>
                  <div className="step">Step 2</div>
                  <div className="step">Step 3</div>
                  <div className="step">Step 4</div>
                  <div className="step">Step 5</div>
                  <hr/>
                </div>
              </div>
            <label>
              Name:
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label>
              Contact:
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <div className='row form-buttons' style={{height: "5%"}}>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-secondary ' type="button" onClick={handlePreviousStep} disabled>
                Previous
              </Button> 
              </div>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-dark' type="button" onClick={handleNextStep}>Next</Button>
              </div>
            </div>
            </Form>
          </FormContainer>
        )}
        {step === 2 && (
          <FormContainer onSubmit={handleNextStep}>
            <Form className="card bg-light" style={{height: '500px'}}>
              <div>
                <h3>Home Type</h3>
                <div className="steps-indicator flex">
                  <div className="step active">Step 1</div>
                  <div className="step active">Step 2</div>
                  <div className="step">Step 3</div>
                  <div className="step">Step 4</div>
                  <div className="step">Step 5</div>
                  <hr/>
                </div>
              </div>
            <label>
              Address:
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <label>
              City:
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <label>
              Zipcode:
              <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
            </label>
            <label>
              Home Type &nbsp; &nbsp;&nbsp;
              <select value={home_type} onChange={(e) => setHomeType(e.target.value)}>
                <option value="">Select a home type</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </label>
            <div className='row' style={{height: "5%"}}>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-secondary' type="button" onClick={handlePreviousStep}>
                Previous
              </Button> 
              </div>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-dark' type="button" onClick={handleNextStep}>Next</Button>
              </div>
            </div>
            </Form>
          </FormContainer>
        )}
        {step === 3 && (
          <FormContainer >
            <Form className="card bg-light" style={{height: '500px'}}>
              <div>
                <h3>Home Type</h3>
                <div className="steps-indicator flex">
                  <div className="step active">Step 1</div>
                  <div className="step active">Step 2</div>
                  <div className="step active">Step 3</div>
                  <div className="step">Step 4</div>
                  <div className="step">Step 5</div>
                  <hr/>
                </div>
              </div>
            <label>
              <Row>
                <Col xs={5}>
                  Area:
                  <input type="number" value={area} onChange={(e) => setArea(e.target.value)} />
                </Col>
                <Col>
                  Bedrooms:
                  <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                </Col>
                <Col>
                  Bathrooms:
                  <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                </Col>
              </Row>

            </label>
            <label>
              Price:
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <div className='row' style={{height: "5%"}}>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-secondary' type="button" onClick={handlePreviousStep}>
                Previous
              </Button> 
              </div>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-dark' type="button" onClick={handleNextStep}>Next</Button>
              </div>
            </div>
            </Form>
          </FormContainer>
        )}
        {step === 4 && (
          <FormContainer onSubmit={handleNextStep}>
            <Form className="card bg-light" style={{height: '500px'}}>
              <div>
                <h3>Home Type</h3>
                <div className="steps-indicator flex">
                  <div className="step active">Step 1</div>
                  <div className="step active">Step 2</div>
                  <div className="step active">Step 3</div>
                  <div className="step active">Step 4</div>
                  <div className="step">Step 5</div>
                </div>
              </div>
            <label>
              Title:
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label> 
            Description:
            <Form.Control
              as="textarea"
              rows={5}
              type='text'
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
              </Form.Control>
          </label>
          <div className='row' style={{height: "5%"}}>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-secondary' type="button" onClick={handlePreviousStep}>
                Previous
              </Button> 
              </div>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-dark' type="button" onClick={handleNextStep}>Next</Button>
              </div>
            </div>
          </Form>
        </FormContainer>
  )}
      {step === 5 && (
        <FormContainer onSubmit={submitHandler}>
          <Form className="card bg-light" style={{height: '500px'}}>
              <div>
                <h3>Home Type</h3>
                <div className="steps-indicator flex">
                  <div className="step active">Step 1</div>
                  <div className="step active">Step 2</div>
                  <div className="step active">Step 3</div>
                  <div className="step active">Step 4</div>
                  <div className="step active">Step 5</div>
                </div>
              </div>
          <label>
            Main Photo:
            <input type="file" onChange={uploadFileHandler} />
            {uploading && <div>Uploading...</div>}
          </label>
          {main_photo && <img src={main_photo} alt="Main" />}
          
          <div className="form-check d-flex justify-content-start">
              <input className="form-check-input" type="checkbox" checked={is_published} onChange={() => setIsPublished(!is_published)} />
              <label className="form-check-label" for="form1Example3">Public</label>
          </div>
          <div className='row' style={{height: "5%"}}>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-secondary' type="button" onClick={handlePreviousStep}>
                Previous
              </Button> 
              </div>
              <div className='col-md-6'>
              <Button className='btn btn-lg w-100 btn-success' type="submit">Submit</Button>
              </div>
          </div>       

          
          </Form>
        </FormContainer>
      )}
</>);
}

export default AddPropertyScreen