import React from "react";
import './styles.css'

const Inbox = ({conversations, active, switchConvo}) => {

     const renderedItems = conversations.map((element, index)=>{
          if (index === active){
               return (
                    <div onClick={() => {switchConvo(index)}} className="convo active-convo" key={index}>
                         {element.first_name} {element.surname}
                    </div>
               )
          }
          else {
               return (
                    <div onClick={() => {switchConvo(index)}} className="convo" key={index}>
                         {element.first_name} {element.surname}
                    </div>
               )
          }
     });

     return (
          <div className="Inbox">
               Inbox/Convos
               {renderedItems}
          </div>
     )
} 

export default Inbox;