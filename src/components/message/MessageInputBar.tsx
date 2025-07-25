// import React, { useState } from 'react';
// import { FaPaperclip, FaPaperPlane, FaEnvelope, FaSms, FaPhone, FaGavel } from 'react-icons/fa';
// import { useSendMessage } from '@/hooks/use-payment';
// import { useParams } from 'next/navigation';

// const MESSAGE_TYPES = [
//   {
//     label: 'Send an email',
//     value: 'email',
//     icon: <FaEnvelope className="w-4 h-4 mr-2" />,
//   },
//   {
//     label: 'Send SMS (UK only)',
//     value: 'sms',
//     icon: <FaSms className="w-4 h-4 mr-2" />,
//   },
//   {
//     label: 'Document a phone call',
//     value: 'call',
//     icon: <FaPhone className="w-4 h-4 mr-2" />,
//   },
//   {
//     label: 'Late payment',
//     value: 'late',
//     icon: <FaGavel className="w-4 h-4 mr-2" />,
//   },
// ];

// const MessageInputBar = ({
//   onAttach,
//   placeholder = 'Send an email...',
// }: {
//   onAttach?: () => void;
//   placeholder?: string;
// }) => {
//   const [message, setMessage] = useState('');
//   const [type, setType] = useState(MESSAGE_TYPES[0].value);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { mutateAsync: sendMessage } = useSendMessage();
//   const { paymentReqId } = useParams();

//   const handleSend = async () => {
//     if (message.trim()) {
//       const res = await sendMessage({
//         message: {
//           content: message,
//           type,
//         },
//         reqId: paymentReqId,
//       });
//       if (res) {
//         setMessage('');
//       }
//     }
//   };

//   const selectedType = MESSAGE_TYPES.find((t) => t.value === type);

//   return (
//     <div className="flex items-center w-full border-t bg-white px-2 py-2 gap-2 sm:gap-3 min-w-0">
//       {/* Dropdown */}
//       <div className="relative flex-shrink-0">
//         <button
//           type="button"
//           className="flex items-center px-2 py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none min-w-[36px] sm:min-w-[40px]"
//           onClick={() => setDropdownOpen((v) => !v)}
//         >
//           {selectedType?.icon}
//         </button>
//         {dropdownOpen && (
//           <div className="absolute left-0 z-10 bottom-full mb-2 w-44 sm:w-56 rounded-md shadow-lg bg-white border border-gray-200">
//             {MESSAGE_TYPES.map((option) => (
//               <button
//                 key={option.value}
//                 className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${type === option.value ? 'bg-gray-100' : ''}`}
//                 onClick={() => {
//                   setType(option.value);
//                   setDropdownOpen(false);
//                 }}
//                 type="button"
//               >
//                 {option.icon}
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* Input */}
//       <input
//         type="text"
//         className="flex-1 min-w-0 rounded-md border border-gray-200 px-2 sm:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white placeholder:text-gray-400"
//         placeholder={placeholder}
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSend();
//           }
//         }}
//       />
//       {/* Attach icon */}
//       <button
//         type="button"
//         className="p-2 sm:p-2.5 text-gray-500 hover:text-green-600 focus:outline-none flex-shrink-0"
//         onClick={onAttach}
//         aria-label="Attach file"
//       >
//         <FaPaperclip className="w-5 h-5" />
//       </button>
//       {/* Send icon */}
//       <button
//         type="button"
//         className="p-2 sm:p-2.5 text-green-600 hover:bg-green-50 rounded-full focus:outline-none flex-shrink-0"
//         onClick={handleSend}
//         aria-label="Send message"
//       >
//         <FaPaperPlane className="w-5 h-5" />
//       </button>
//     </div>
//   );
// };

// export default MessageInputBar; 