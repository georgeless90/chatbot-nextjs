'use client';
import React from 'react';
import Image from "next/image";
import Services from "../share-utilities/services/_services";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'

export default function Home() {

  let iconChat = '/images/blue.jpeg';
  let headerImage = '/images/atak.png';

  const [message, setMessage] = React.useState('')
  const [showChat, setShowChat] = React.useState(false);
  const [messages, setMessages] = React.useState([]);


  const handleShowChat = () => {
    !showChat ? setShowChat(true) : setShowChat(false);
  }

  const handleChat = () => {
    const newMessage = {
      body: message,
      from: 'me'
    }
    setMessages(state => [...state, newMessage])
    setMessage("")

    Services.chatMessage(newMessage.body)
      .then((response) => {
        console.log('res', response.ai_output)
        const aiMessage = {
          body: response.ai_output,
          from: 'ai'
        }
        setMessages(state => [...state, aiMessage])
      })
  }

  return (
    <>
      {
        showChat ? (
          <div className="wrapper">

            <div className="title">
              <div className='wrapper_left'>
                <Image
                  className='image--header'
                  src={headerImage}
                  width={100}
                  height={100}
                  alt="section-img"
                />
                Asystent chatbot
              </div>
              <FontAwesomeIcon className='close-chat' icon={faAngleDown} onClick={handleShowChat} />
            </div>
            <div className="box">
              {messages.map((message, index) => (
                <div key={index}>
                  {
                    message.from == 'me' ? (
                      <div className="item right">
                        <div className="msg">
                          <p>{message.body}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="item">
                        <div className="msg">
                          <p>{message.body}</p>
                        </div>
                      </div>
                    )
                  }
                </div>
              ))}
            </div>

            <div className="typing-area">
              <div className="input-field">
                <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} placeholder="Type your message" required />
                <button type="button"
                  onClick={handleChat}>Send</button>
              </div>
            </div>
            <div className="footer">
              Asystent chatbot
            </div>
          </div>
        ) : (
          <div className='cont-icon' onClick={handleShowChat}>
            <FontAwesomeIcon className='icon--open-chat' icon={faCommentDots} />
          </div>
        )}
    </>
  )
}
