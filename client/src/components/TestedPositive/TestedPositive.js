import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from "react-bootstrap";
import  { Navigate } from 'react-router-dom';
import Navbar from '../Navbar';
import {useCookies} from 'react-cookie';

const TestedPositive = () => {

    const [date,setDate]= useState("");
    const [submitted, setSubmitted] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const id=cookies.UserId;
    
    const onDateChange = (e) => {
        setDate(e.target.value);
    }

    const onPositiveCase = (e)=> {
        e.preventDefault();
        const emails=[];
        const submitCovidCase = async () => {
            const body = {UserId: id, date: moment(date).format("YYYY-MM-DD"), emails :[]}
            await axios
            .post(`/covid/tested-positive`, body)
            .then( async (response) => {
                response.data.map((email)=> {
                    body.emails.push(email.email);
                })


                
                await axios 
                .post ('/send', body)
                .then((response) => setSubmitted(true))
                .catch((err) => {
                    console.log(err);
                })
                
            })
            .catch((err) => {
                console.log(err);
            })
        }
        
        submitCovidCase();
        


    }

    const closeModal = () => {
        setSubmitted(false);
        return <Navigate to='/'  />;
    }
  return (
    <div>
        <Navbar 
            isLogin={false}
        />
        <Form onSubmit={onPositiveCase}>
            <Form.Group>
                <Form.Label>
                    Date Of Positive Result
                </Form.Label>
                <Form.Control type='date' onChange={onDateChange}></Form.Control>
            </Form.Group>
            <Button variant="danger" size="lg" type='submit'> Confirm</Button>
        </Form>
        <Modal show={submitted} onHide= {closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title> Please Stay Safe!</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    Please avoid setting up dates for the next 14 days and follow your local 
                    government rules for positive covid cases
                </ModalBody>
            </Modal>
    </div>
  )
}

export default TestedPositive;