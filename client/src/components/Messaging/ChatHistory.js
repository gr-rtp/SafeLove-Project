import React, {useEffect, useRef} from "react";

const ChatHistory = ({messages, messageReceived, id}) => {
    const historyRef = useRef(null);

    useEffect(() => {
        historyRef.current?.scrollIntoView(false);
    }, []);

    const renderedMessages = messages.map((el, index) => {
        if (el.sender === id){
            return (
                <div key={index} className="message-sent">
                    <div className="left-block"></div>
                    <div className="msg">
                        {el.message}
                    </div>
                    
                </div>
            )
        }
        else {
            return (
            <>
                <div key={index} className="message-recv">
                    {el.message}
                </div>
            </>
            )
        }
    });

    if (messages.length === 0){
        return (
            <>
                <div ref={historyRef} className="chat-history-container">
                    No Messages
                </div>
            </>
        )
    }

    return (
    <>
        <div ref={historyRef} className="chat-history-container">
            {renderedMessages}
        </div>
    </>
    )
}

export default ChatHistory;