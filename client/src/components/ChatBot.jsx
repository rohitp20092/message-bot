import React, { useState} from "react";
import io from 'socket.io-client';
import { Launcher } from '@wealize/react-chat-window'

const SERVER = "http://localhost:8080";
const socket = io(SERVER);

const ChatBot = () => {
  const [messages, setMessages] = useState([{ author: 'them',	type: 'text', data: { id: 1 , text: "Hi" }}]);
	const [count, setCount] = useState(1);

	const _onMessageWasSent = async (message) => {
		let newMessages = [...messages, message];
  	await socket.emit('new-msg', { id: count, text: message.data.text });
		setCount(count + 1);
		setMessages(newMessages);
  }
 
  socket.on('reply-msg', message => {
	_sendMessage(message);
  });


  const _sendMessage = (text) => {
    if (text?.length > 0) {
			const newMessages = [...messages, {
				author: 'them',
				type: 'text',
				data: { id: count, text }
			}]
			console.log(messages);
			setCount(count + 1);
			setMessages(newMessages);
    }
  }

	const onFilesSelected = () => {
		console.log("file selected");
	}

	const yesElement = document.querySelector('#yes');
	const noElement = document.querySelector('#no');
	if (yesElement) {
		yesElement.onclick = async (e) => {
			e.stopPropagation();
			e.preventDefault();
			document.getElementsByName("button").forEach(ele => ele.style.display = "none");
			await _onMessageWasSent({ author: 'me', type: 'text', data: { id: count, text: 'yes' }});
			await socket.emit('new-msg', { id: 0, text: 'yesBtnPressed', count });
		};
	}
	if (noElement) {
		noElement.onclick = async (e) => {
			e.stopPropagation();
			e.preventDefault();
			console.log("click no");
			document.getElementsByName("button").forEach(ele => ele.style.display = "none");
			await _onMessageWasSent({ author: 'me', type: 'text', data: { id: count, text: 'no' }});
			await socket.emit('new-msg', { id: 0, text: 'noBtnPressed', count });
		};
	}
  return (
    <div className="chat">
      <h1>Chatbot</h1>
      <Launcher
				agentProfile={{
						teamName: 'Chatbot',
						imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
				}}
				onMessageWasSent={_onMessageWasSent}
				onFilesSelected={onFilesSelected}
				isOpen={true}
				messageList={messages}
				verticalQuickReplies={true}
			/>

    </div>
  );
};

export default ChatBot;
