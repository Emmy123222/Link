import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import { FaPaperPlane, FaComments } from 'react-icons/fa';

interface Message {
  id?: string;
  message: string;
  change_date: string;
  [key: string]: any;
}

interface MessageDisplayProps {
  messages: Message[];
  className?: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  className = ''
}) => {
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight - messagesScrollRef.current.clientHeight;
    }
  }, [messages]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <FaComments className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">Messages</h3>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {messages.length}
          </span>
        </div>
      </div>

      <div className="relative pl-4 border-l-2 border-gray-200">
        <div ref={messagesScrollRef} className="overflow-y-auto max-h-[200px] min-h-[200px] p-4 scroll-smooth">
          {messages.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">No messages to display.</div>
          ) : (
            messages.map((item, idx) => (
              <div key={item.id || idx} className="mb-6 last:mb-0 flex items-start">
                <div className="ml-8 flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-1">
                    {moment(item.change_date).format('DD MMM YYYY, h:mm a')}
                  </div>
                  <div className="font-semibold text-sm text-gray-800 break-words">
                    {item.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay; 