import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'reactstrap';

const MEDSPECIFIC = ({isLoggedIn, setAuth}) => {

    const loggedIn = isLoggedIn;

    const [customer_id, setCustomerId] = useState("");
    
    const getProfile = async () => {
        try {
            const res = await fetch(`http://localhost:5000/customer/`, {
                method: "POST",
                headers: { token: localStorage.token }
            });

            const parseRes = await res.json();
            // console.log(parseRes);
            // console.log(parseRes.customer_id);

            setCustomerId(parseRes.customer_id);
            

            
        } catch (error) {
            console.error(error.message);
        }
    }

    const id = useParams();
    const [medicine, setMedicine] = useState({});
    const [manufacturer, setManufacturer] = useState('');
    const [quantity, setQuantity] = useState(0);

    const getMedicine = async () => {
        try {
            const response = await fetch(`http://localhost:5000/medicine/get/${id.id}`);
            const jsonData = await response.json();
            setMedicine(jsonData);

            if (jsonData.manufacturer_id) {
                const responseForManufacturer = await fetch(`http://localhost:5000/manufacturer/${jsonData.manufacturer_id}`);
                const jsonDataForManufacturer = await responseForManufacturer.json();
                setManufacturer(jsonDataForManufacturer.manufacturer_name);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        getProfile();
        // console.log(customer_id);
        getMedicine();
    }, []);

    const addToCart = async () => {
        // Implement add to cart functionality here
        console.log(`Added ${quantity} ${medicine.med_name}(s) to cart`);

        const data = {
            user_id: customer_id,
            product_id: id.id,
            quantity: quantity
        };

        try {
            const response = await fetch("http://localhost:5000/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify(data)
            });

            const parseRes = await response.json();
            console.log(parseRes);
        } catch (error) {
            console.error(error.message);
        }

    };

    return (
        <div>
            <h1 className="text-center mt-5">{medicine.med_name}</h1>
            <Container>
                <Row>
                    <Col>
                        <Card className="p-3">
                            <div className="d-flex align-items-start">
                                <div className="border border-secondary rounded overflow-hidden mr-3" style={{ width: '400px', height: '400px' }}>
                                    <img src={medicine.image} alt={`Image of ${medicine.med_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div id="product_details" className="d-flex flex-column" style={{ marginLeft: '40px', width: '500px' }}>
                                    <div className="align-self-start">
                                        <h6 className="text-secondary font-weight-bold" style={{ fontSize: '1.25rem' }}>{medicine.med_form}</h6>
                                        <div className="generes-wrap">
                                            <p className="generes ml-0"><strong>Generics:</strong><span className="font-weight-bold" style={{ fontSize: '1rem' }}>{medicine.generic_name}</span></p>
                                        </div>
                                        <p className="manufacturer" style={{ fontSize: '1rem' }}>{manufacturer && <span className="font-weight-bold">{manufacturer}</span>}</p>
                                    </div>
                                    <div className="align-self-start">
                                        <label className="">
                                            <span className="price-label font-weight-bold" style={{ fontSize: '1.25rem' }}>Price : ৳ </span>
                                            <label className="price font-weight-bold" style={{ fontSize: '1.25rem' }}>{medicine.price}</label>
                                            <span className="regular-price font-weight-bold" style={{ fontSize: '1rem' }}>{medicine.regular_price}</span>
                                        </label>
                                        <div className="d-flex align-items-center mt-2">
                                            <Button onClick={addToCart}  style={{ padding: '10px', margin: '10px' , backgroundColor:'rgb(226,135,67)'}}>Add to Cart</Button>
                                            <div className="input-group" style={{ width: '150px' }}>
                                                <button className="btn btn-outline-secondary btn-lg" type="button" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 0)} style={{ backgroundColor: 'rgb(6,57,112)' }}>-</button>
                                                <input type="text" className="form-control text-center" value={quantity} readOnly style={{ width: '50px', fontSize: '0.9rem' }} />
                                                <button className="btn btn-outline-secondary btn-lg" type="button" onClick={() => setQuantity(quantity + 1)} style={{ backgroundColor: 'rgb(6,57,112)' }}>+</button>
                                            </div>

                                        </div>
                                    </div>
                                    <div id="prescription_and_availability">
                                        <label className="font-weight-bold" style={{ fontSize: '1rem' }}>Prescription Required <i className="fa ml-2"></i></label>
                                        <label className="font-weight-bold" style={{ fontSize: '1rem' }}>will be available</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p style={{ fontSize: '1.5rem' }}><b>Indication:</b> {medicine.indication}</p>
                                    <p style={{ fontSize: '1.5rem' }}><b>Dosage: </b>{medicine.dosage}</p>
                                    <p style={{ fontSize: '1.5rem' }}><b>Dosage Strength: </b>{medicine.dosagestrength}</p>
                                    <p style={{ fontSize: '1.5rem' }}><b>Cautions: </b>{medicine.cautions}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MEDSPECIFIC;
