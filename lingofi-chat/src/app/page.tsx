// "use client"
// import { ChatPanel } from '@/components/chat-panel';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { AI } from '@/lib/chat/actions';
// import { useState, KeyboardEvent } from 'react';
// import { Session } from '@/lib/types'

// type TextMessage = {
//   type: 'text';
//   text: string;
//   sender: 'user' | 'bot';
// };

// type CardMessage = {
//   type: 'card';
//   content: string;
//   sender: 'bot';
//   buttonText: string;
// };

// type Message = TextMessage | CardMessage;

// export default function Chat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>('');

//   const handleSendMessage = (): void => {
//     if (input.trim() !== '') {
//       const newUserMessage: TextMessage = { type: 'text', text: input, sender: 'user' };
//       setMessages(prevMessages => [...prevMessages, newUserMessage]);
//       setInput('');

//       setTimeout(() => {
//         const newBotMessage: CardMessage = {
//           type: 'card',
//           content: `You said: "${input}". What would you like to do next?`,
//           sender: 'bot',
//           buttonText: 'Respond'
//         };
//         setMessages(prevMessages => [...prevMessages, newBotMessage]);
//       }, 1000); // simulate network delay
//     }
//   };

//   const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
//     if (event.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   const renderMessage = (message: Message, index: number) => {
//     if (message.type === 'text') {
//       return (
//         <div key={index} className={`text-right ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
//           <p className={`inline-block p-2 my-1 rounded-full ${message.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
//             {message.text}
//           </p>
//         </div>
//       );
//     } else if (message.type === 'card') {
//       return (
//         <div key={index} className="my-2 flex flex-col items-start">
//           <div className="border p-4 rounded bg-white shadow">
//             <p>{message.content}</p>
//             <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">{message.buttonText}</button>
//           </div>
//         </div>
//       );
//     }
//   };


//   return (
// <></>

//   );
// }
"use client"
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [message, setMessage] = useState('');
  const [stringUrl, setStringUrl] = useState('');

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const url = 'http://localhost:8080/api/string/';
    const data = { email, amount, currency };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'mode': 'no-cors',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setStringUrl(result.data);
      setMessage(result.message);
    } catch (error) {
      setMessage('Internal Server Error');
      console.error('Error:', error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Send Data</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="text"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Currency:</label>
          <input
            type="text"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
      {message && <p>{message}</p>}
      {stringUrl && <p>{stringUrl}</p>}
    </div>
  );
}
