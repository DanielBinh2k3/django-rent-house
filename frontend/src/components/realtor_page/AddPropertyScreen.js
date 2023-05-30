import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import FormContainer from "../common/FormContainer";
import { useDispatch, useSelector } from 'react-redux';
import axios, { formToJSON } from 'axios'
import { createListing } from "../../apiRequest/actions/listingActions";
import { useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import Message1 from "../common/Message1";
const AddPropertyScreen = () => {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("")
  const [home_type, setHomeType] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [main_photo, setMainPhoto] = useState(null);
  const [uploaded_images, setUploadedImages] = useState([]);
  const [is_published, setIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [previewURL, setPreviewURL] = useState('');
  const [previewURLs, setPreviewURLs] = useState([]);
  const [countdown, setCountdown] = useState(3); // set initial countdown to 3 seconds
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const userLogin = useSelector((state) => state.userLogin)
  const {userInfo} = userLogin
  const createdListing = useSelector((state) => state.listingCreate);
  const { loading, error, success } = createdListing;
  useEffect(() => {
    let interval = null;
    if (success) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [success]);

  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

const submitHandler = async (e) => {
  e.preventDefault();
  setUploading(true);
  console.log(main_photo)
  console.log(uploaded_images)
  const formData = new FormData();
  formData.append("phone_contact", contact);
  formData.append("home_type", home_type);
  formData.append("address", address);
  formData.append("city", city);
  formData.append("district", district);
  formData.append("zipcode", zipcode);
  formData.append("area", area);
  formData.append("price", price);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("main_photo", main_photo);
  uploaded_images.map((file, index) => {
    formData.append(`uploaded_images[${index}]`, file);
  });

  formData.append("is_published", is_published);
  formData.append("bedrooms", bedrooms);
  formData.append("bathrooms", bathrooms);
  console.log(formToJSON(formData))
  dispatch(createListing(formData));
};

  const handleNextStep = (event) => {
    event.preventDefault();
    setStep(step + 1);
  };

  const handlePreviousStep = (event) => {
    event.preventDefault();
    setStep(step - 1);
  };

  const handleFileChange = (e) => {
    console.log(e.target.files)
    setMainPhoto(e.target.files[0]);
    if (main_photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(main_photo);
    }
  };

  const handleMultiFileChange = (event) => {
  const files = Array.from(event.target.files);
  setUploadedImages(files);
  }

  return (
    <>
      {loading && <Loader/>}
      {error && <Message1 variant="danger">{error}</Message1>}

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
              <input type="text" value={userInfo.name}  disabled/>
            </label>
            <label>
              Email:
              <input type="text" value={userInfo.email}  disabled/>
            </label>
            <label>
              Contact:
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
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
              District:
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </label>
            <label>
              Zipcode:
              <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} />
            </label>
            <label>
              Home Type &nbsp; &nbsp;&nbsp;
              <select value={home_type} onChange={(e) => setHomeType(e.target.value)}>
                <option value="">Select a home type</option>
                <option value="House">House</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
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
                {success && (<Message1 variant="success">Listing created successfully! Redirecting to homepage in <span>{countdown} seconds...</span></Message1>)}
                <div className="steps-indicator flex">
                  <div className="step active">Step 1</div>
                  <div className="step active">Step 2</div>
                  <div className="step active">Step 3</div>
                  <div className="step active">Step 4</div>
                  <div className="step active">Step 5</div>
                </div>
              </div>
          <label htmlFor="image" >
            Main Photo:
            <input type="file" onChange={handleFileChange}/>
           <input type="file" multiple onChange={handleMultiFileChange} />
            {uploading && <div>Upload done</div>}
          </label>
          <div className="row" style={{height: '6rem'}}>
            <div className="col-md-4">
              {main_photo && <img src={previewURL} alt="Main" />}
            </div>
            <div >
              <div className="col-md2">
                {previewURLs.map((url, index) => (
                  <img key={index} src={url} alt={`Preview ${index}`} />
                ))}
              </div>
            </div>
          </div>
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
              <Button className='btn btn-lg w-100 btn-success' onClick={submitHandler}>Submit</Button>
              </div>
          </div>       

          
          </Form>
        </FormContainer>
      )}
</>);
}

export default AddPropertyScreen