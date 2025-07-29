import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRealtimeListener } from '@/hooks/use-realtime-listener';
import { useParams } from 'next/navigation';
import { useMessages } from '@/hooks/use-payment';
import { FaExclamationTriangle, FaFileInvoiceDollar, FaInfoCircle, FaPaperPlane, FaPencilAlt, FaPlus, FaCheckCircle } from 'react-icons/fa';
import moment from 'moment';
import { Avatar } from './avatar';
import { useApp } from '@/providers/AppProvider';
import Iframe from 'react-iframe'
import Link from 'next/link';

const eventIcons = {
  paid: <FaCheckCircle className="text-emerald-500" />,
  update: <FaPencilAlt className="text-blue-500" />,
  late_payment: <FaExclamationTriangle className="text-amber-500" />,
  created: <FaPlus className="text-emerald-500" />,
  email: <FaPaperPlane className="text-indigo-500" />,
  letter: <FaFileInvoiceDollar className="text-amber-500" />,
  sms: <FaPaperPlane className="text-indigo-500" />,
  info: <FaInfoCircle className="text-sky-500" />
};

const eventColors = {
  paid: 'border-emerald-500 bg-emerald-50',
  update: 'border-blue-500 bg-blue-50',
  late_payment: 'border-amber-500 bg-amber-50',
  created: 'border-emerald-500 bg-emerald-50',
  email: 'border-indigo-500 bg-indigo-50',
  letter: 'border-amber-500 bg-amber-50',
  sms: 'border-indigo-500 bg-indigo-50',
  info: 'border-sky-500 bg-sky-50',
};

const eventLabels = {
  paid: 'Payment Received',
  update: 'Updated',
  late_payment: 'Late Payment Reminder',
  created: 'Created',
  email: 'Email Sent',
  letter: 'Letter Sent',
  sms: 'SMS Sent',
  info: 'Information',
};

const Timeline = ({ className, vendorName, customerName }: { className?: string, vendorName?: string, customerName?: string }) => {
  const { paymentReqId } = useParams()
  const { user } = useApp()
  const [messages, setMessages] = useState<any[]>([])
  const { data: messagesData, refetch } = useMessages(paymentReqId as string)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useRealtimeListener({
    channelName: 'messages',
    table: 'Messages',
    event: 'INSERT',
    schema: 'public',
    filter: `request_id=eq.${paymentReqId}`,
    onChange: (payload) => {
      setMessages(prev => [...prev, payload.new])
    }
  })

  useEffect(() => {
    refetch()
  }, [paymentReqId])

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData || [])
    }
  }, [messagesData])

  // Enhanced auto-scroll functionality 
  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  const isAtBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 50; // 50px threshold for better detection
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const newMessagesArrived = messages.length > lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    if (newMessagesArrived) {
      if (shouldAutoScroll && !isUserScrolling) {
        // Small delay to ensure DOM is updated
        setTimeout(() => scrollToBottom(true), 100);
      } else {
        // Show indicator for new messages when user is not at bottom
        setHasNewMessages(true);
      }
    }
  }, [messages, shouldAutoScroll, isUserScrolling, scrollToBottom]);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  // Handle scroll events to detect user scrolling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const atBottom = isAtBottom();
    setShouldAutoScroll(atBottom);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set user scrolling flag
    setIsUserScrolling(true);

    // Clear the user scrolling flag after a delay
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      // Re-check if we're at bottom when user stops scrolling
      if (isAtBottom()) {
        setShouldAutoScroll(true);
        setHasNewMessages(false);
      }
    }, 1500);
  }, [isAtBottom]);

  // Handle wheel events to detect manual scrolling
  const handleWheel = useCallback(() => {
    setIsUserScrolling(true);
    setShouldAutoScroll(false);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset auto-scroll after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      setShouldAutoScroll(isAtBottom());
    }, 1500);
  }, [isAtBottom]);

  // Handle touch events for mobile scrolling
  const handleTouchStart = useCallback(() => {
    setIsUserScrolling(true);
    setShouldAutoScroll(false);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTimeAgo = (date: string | number) => {
    const now = moment();
    const eventDate = moment(date);
    const diff = now.diff(eventDate, 'minutes');

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return eventDate.format('DD MMM YYYY');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

        {/* Scroll to bottom button */}
        {!shouldAutoScroll && (
          <button
            onClick={() => {
              scrollToBottom(true);
              setShouldAutoScroll(true);
              setIsUserScrolling(false);
              setHasNewMessages(false);
            }}
            className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            title={hasNewMessages ? "New messages - Scroll to bottom" : "Scroll to bottom"}
          >
            {hasNewMessages && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}

        <div
          className="overflow-y-auto pr-4 space-y-6"
          ref={scrollContainerRef}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 #F1F5F9' }}
          onScroll={handleScroll}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
        >
          {messages?.map((item, idx) => (
            <div
              key={idx}
              className="relative group animate-slide-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className={`
                    w-12 h-12 flex items-center justify-center rounded-full border-2 shadow-lg bg-white 
                    transition-all duration-200 group-hover:scale-90 group-hover:shadow-xl
                    ${eventColors[item.type as keyof typeof eventColors] || 'border-gray-300 bg-gray-50'}
                  `}>
                    {eventIcons[item.type as keyof typeof eventIcons] || <FaFileInvoiceDollar className="text-gray-500" />}
                  </div>

                  {idx !== messages.length - 1 && (
                    <div className="absolute left-1/2 top-12 w-px h-6 bg-gradient-to-b from-gray-300 to-gray-200 transform -translate-x-1/2" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {eventLabels[item.type as keyof typeof eventLabels] || 'Event'}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {moment(item.created_at).format('DD MMM YYYY, h:mm a')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">by</span>
                      <Avatar
                        src={item.user?.avatar_url}
                        name={item.user?.name}
                        width={28}
                        height={28}
                        className="rounded-full ring-2 ring-white shadow-sm"
                      />
                      <span className="text-xs font-medium text-gray-700 max-w-24 truncate">
                        {item.user?.name}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group-hover:border-gray-200">
                    {item.type === 'paid' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <div className="font-semibold text-gray-900">Payment received successfully</div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Amount: <span className="font-semibold text-emerald-600">{formatAmount(item.amount)}</span>
                        </div>
                        {item.payment_method && (
                          <div className="text-xs text-gray-500">
                            Method: {item.payment_method}
                          </div>
                        )}
                      </div>
                    )}

                    {item.type === 'update' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="font-semibold text-gray-900">Payment request updated</div>
                        </div>
                        <div className="text-sm text-gray-700 break-words">{item.message.split("\n").map((line: string, index: number) => (
                          <span key={index}>{line}<br /></span>
                        ))}</div>
                      </div>
                    )}

                    {item.type === "late_payment" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          <div className="font-semibold text-gray-900">Late payment reminder sent</div>
                        </div>
                        {item.message && (
                          <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <div className="p-3 bg-gray-100 border-b border-gray-200">
                              <span className="text-xs font-medium text-gray-600">Payment Reminder Document</span>
                            </div>
                            <Iframe url={item.message} width="100%" height="100%" />
                            <Link href={item.message} target="_blank" className="text-xs text-gray-500">View Document</Link >
                          </div>
                        )}
                      </div>
                    )}
                    {item.type === "letter" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          <div className="font-semibold text-gray-900">Letter sent to customer</div>
                        </div>
                        {item.message && (
                          <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            <div className="p-3 bg-gray-100 border-b border-gray-200">
                              <span className="text-xs font-medium text-gray-600">Letter Document</span>
                            </div>
                            <Iframe url={item.message} width="100%" height="100%" />
                            <Link href={item.message} target="_blank" className="text-xs text-gray-500">View Document</Link >
                          </div>
                        )}
                      </div>
                    )}
                    {item.type === 'created' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div className="font-semibold text-gray-900">Payment request created</div>
                        </div>

                        <div className="text-sm text-gray-700 break-words bg-gray-50 p-3 rounded-lg border-l-4 border-emerald-200">
                          {item.message.split("\n").map((line: string, index: number) => (
                            <span key={index}>{line}<br /></span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.type === 'info' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                          <div className="font-semibold text-gray-900">Information</div>
                        </div>
                        <div className="text-sm text-gray-700 break-words">{item.message.split("\n").map((line: string, index: number) => (
                          <span key={index}>{line}<br /></span>
                        ))}</div>
                      </div>
                    )}

                    {item.type === 'email' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <div className="font-semibold text-gray-900">Message sent to customer</div>
                        </div>
                        <div className="text-sm text-gray-700 break-words bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-200">
                          {item.message.split("\n").map((line: string, index: number) => (
                            <span key={index}>{line}<br /></span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.type === 'sms' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          <div className="font-semibold text-gray-900">Message sent to customer</div>
                        </div>
                        <div className="text-sm text-gray-700 break-words bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-200">
                          {item.message.split("\n").map((line: string, index: number) => (
                            <span key={index}>{line}<br /></span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaInfoCircle className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-500">Activity and messages will appear here once they occur.</p>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default Timeline; 