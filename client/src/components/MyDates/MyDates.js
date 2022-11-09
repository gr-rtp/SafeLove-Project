import React, {useState, useEffect, useRef} from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import moment from 'moment';
import {useCookies} from 'react-cookie';
import Navbar from '../Navbar';


const MyDates = () => {

    const [dates,setDates]= useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const id=cookies.UserId;

    useEffect(() => {
        const getDates = async () => {
            await axios.get(`/user/dates/${id}`)
            .then((data) => {
                setDates(data.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }

        getDates();
    }, []);


  return (
    <div>
        <Navbar 
            isLogin={false}
        />
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {(dates.length === 0) ?  <>No dates available</> : (dates.map((element,index)=>{
                   return (<tr key={index}>
                        <td> {index+1}</td>
                        <td> {element.first_name + " " + element.surname}</td>
                        <td> {moment(element.date).format("YYYY-MM-DD")}</td>
                        <td> {element.time}</td>
                    </tr>)
                }))}
            </tbody>
        </Table>


    </div>
  )
}

export default MyDates;