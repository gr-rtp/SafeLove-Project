import React, {useState, useEffect, useRef, useContext} from 'react';
import ChatHistory from './ChatHistory';
import Inbox from './Inbox';
import "./styles.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import io from "socket.io-client";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from "react-bootstrap";
import { CalendarHeart } from 'react-bootstrap-icons';
import moment from 'moment';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import {useCookies} from 'react-cookie';
import { decryptMessage, encryptMessage } from "./aes.js";
//randomly generated id to mimic a client
//this would usually be session storage


//initialise socket client. connect to backend
//query object can be accessed by socket server


const MessagingPage = (props) => {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(0);
    const [displayModal, setDisplayModal]= useState(false);
    const [datePicked,setDatePicked]= useState("");
    const [dateConfirmed, setDateConfirmed] = useState({success:false,error:false});
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const id=cookies.UserId;
    
    useEffect(() => {
        
        const fetchMatches = async () => {
            await axios.get(`/messaging/matches/${id}`)
            .then((data) => {
                setConversations(data.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }

        fetchMatches();
    }, []);
    const sendMessage = () => {
        let messageData = {
            sender: id,
            message: encryptMessage(message),
            convoID: conversations[activeConversation].match_id,
        }
        props.socket.emit("send_message", {messageData});
        messageData.message= message;
        setMessages((messages) => ([...messages, messageData]));
        setMessage("");
    }
    //fetch all the matches for the user that logged in
    

    //fetch all the messages for the currently active conversation
    useEffect(() => {
        const fetchMessages = async () => {
            if (conversations.length === 0) {
                return;
            }

            const convoID = conversations[activeConversation].match_id;
            const messages = await axios.get(`/messaging/messages/${convoID}`)
                .then((data) => {
                    data.data.map((message) => {
                        message.message = decryptMessage(message.message)
                    })
                    setMessages(data.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }

        fetchMessages();
    }, [conversations, activeConversation]);

    useEffect(() => {
        props.socket.on("receive_message", (data) => {
            data.messageData.message= decryptMessage(data.messageData.message);
            setMessages((messages) => ([...messages, data.messageData]));
        })
    }, [props.socket]);

    //switch conversations
    const switchConvo = (index) => {
        setActiveConversation(index);
    }

    const openModal = () => {
        
        setDisplayModal(!displayModal);
    };

    const onDateChange =(e) => {
        setDatePicked(e.target.value);
    }

    const confirmDate = (e) => {
        e.preventDefault();
        const submitDate = async () => {
            const body = {matchID: conversations[activeConversation].match_id,
                          date: moment(datePicked).format("YYYY-MM-DD"),
                          time: moment(datePicked).format("HH:mm")};
            
           const success = await axios
            .post(`/covid/confirm-date`, body)
            .then((response) =>{
                
                setDateConfirmed({success:true, error: false});
            })
            .catch((err) => {
                setDateConfirmed({success:false, error: true});
                console.log(err)
            })
            };
    
      
        submitDate();
        
        
    }

    return (
        <>
            
            
        <div className="MessagingPage">
            <div className="inbox">
                <Inbox conversations={conversations} active={activeConversation} switchConvo={switchConvo}/>
            </div>
            <div className="chat-history">
                <ChatHistory messages={messages} id={id}/>
            </div>
            <div className="message-input">
                <button onClick = {openModal}className='date-button'><span><CalendarHeart size={30}/></span></button>
                <input value={message} onChange={(event) => {setMessage(event.target.value);}}></input>
                <Button onClick={sendMessage} className="send-btn" variant="primary">Send</Button>
            </div>

            <Modal show={displayModal} onHide={openModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Setup a Date!</Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <Form onSubmit={confirmDate} style={{display: 'block'}}>
                        <Form.Group> 
                            <Form.Label> Date & Time </Form.Label>
                            <Form.Control  type="datetime-local" onChange={onDateChange} min={(new Date().toISOString()).slice(0,-8)} ></Form.Control >
                        </Form.Group>
                        <Button  variant="primary" type="submit" onClick={openModal}>Send</Button>
                    </Form>
                </ModalBody>
            </Modal>
            <ToastContainer className="p-3" position={'top-center'}>
            <Toast onClose={() => setDateConfirmed({success:false, error: false})} show={dateConfirmed.success} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Your Date Is Booked!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>Enjoy your date!</Toast.Body>
            </Toast>
            </ToastContainer>
            <ToastContainer className="p-3" position={'top-center'}>
            <Toast onClose={() => setDateConfirmed({success:false, error: false})} show={dateConfirmed.error} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">There was an Error!</strong>
                    <small>now</small>
                </Toast.Header>
                <Toast.Body>Please try again!</Toast.Body>
            </Toast>
            </ToastContainer>
        </div>
        </>
    );
}

export default MessagingPage;