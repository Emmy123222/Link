import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import { FaFileInvoiceDollar, FaMoneyBillWave, FaEdit, FaCheckCircle, FaExclamationTriangle, FaHistory } from 'react-icons/fa';

interface HistoryEvent {
  id?: string;
  type: string;
  content?: string;
  amount?: number;
  url?: string;
  change_date: string;
  [key: string]: any;
}

interface HistoryDisplayProps {
  history: HistoryEvent[];
  className?: string;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({
  history,
  className = ''
}) => {
  const historyScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (historyScrollRef.current) {
      historyScrollRef.current.scrollTop = historyScrollRef.current.scrollHeight;
    }
  }, [history]);

  const filteredHistory = history?.filter(item => item.type !== "sent") || [];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <FaHistory className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">History</h3>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {filteredHistory.length}
          </span>
        </div>
      </div>

      <div className="relative pl-4 border-l-2 border-gray-200">
        <div ref={historyScrollRef} className="overflow-y-auto max-h-[200px] min-h-[200px] p-4 scroll-smooth">
          {filteredHistory.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-8">No history to display.</div>
          ) : (
            filteredHistory.map((item, idx) => (
              <div key={item.id || idx} className="mb-6 last:mb-0 flex items-start">
                <div className="ml-8 flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-1">
                    {moment(item.change_date).format('DD MMM YYYY, h:mm a')}
                  </div>

                  {item.type === 'paid' && (
                    <>
                      <div className="font-semibold text-sm text-gray-800">Payment received</div>
                      <div className="text-xs text-gray-600">
                        Amount: £{item.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </>
                  )}

                  {item.type === 'update' && (
                    <div className="font-semibold text-sm text-gray-800 break-words">
                      {item.content}
                    </div>
                  )}

                  {item.type === "late_payment" && (
                    <div className="font-semibold text-sm text-gray-800 w-full">
                      <div className="mb-2">Late payment reminder sent</div>
                      {item.url && (
                        <div className="w-full overflow-hidden rounded border">
                          <iframe
                            src={item.url as string}
                            width="100%"
                            height="200px"
                            className="border-0"
                            title="Payment reminder"
                            sandbox="allow-scripts allow-same-origin"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {item.type === 'created' && (
                    <div className="font-semibold text-sm text-gray-800 break-words">
                      {item.content}
                    </div>
                  )}

                  {item.type === 'info' && (
                    <div className="font-semibold text-sm text-gray-800 break-words">
                      {item.content}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDisplay; 