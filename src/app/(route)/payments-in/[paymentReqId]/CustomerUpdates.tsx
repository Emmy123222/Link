import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import moment from 'moment';

const CustomerUpdates = ({ paymentRequestData }: { paymentRequestData: any }) => {

  if (!paymentRequestData) return null;

  const paymentDone = paymentRequestData?.payment_done;
  const paymentMethod = paymentRequestData?.payment_method || '-';
  const promisedDate = paymentRequestData?.plan_due_date ? moment(paymentRequestData.plan_due_date).format('DD MMM YYYY') : '-';

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <h3 className="font-semibold mb-4 text-gray-800 text-base sm:text-lg">Customer Updates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-medium">Promise to pay</span>
            <span className="text-sm sm:text-base font-medium text-gray-900 break-words">
              {promisedDate}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-medium">Payment method</span>
            <span className="text-sm sm:text-base font-medium text-gray-900 break-words">
              {paymentMethod}
            </span>
          </div>
          <div className="flex flex-col space-y-1 sm:col-span-2 lg:col-span-1">
            <span className="text-xs text-gray-500 font-medium">Payment done</span>
            <Badge
              variant={paymentDone ? 'success' : 'error'}
              className="flex items-center w-fit text-xs sm:text-sm px-2 py-1"
            >
              {paymentDone ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              ) : (
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
              )}
              <span className="whitespace-nowrap">{paymentDone ? 'Yes' : 'No'}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerUpdates; 