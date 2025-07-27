import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentRequestType } from '@/types/payments';
import { formatCurrency, formatPercentage } from '@/utils/utils';

interface InvoiceItem {
  id?: number;
  name: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount: number;
  tax_amount: number;
  totalAmount: number;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  documentType: string;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items, documentType }) => {
  // Only show table if document type is Invoice
  if (documentType !== PaymentRequestType.INVOICE) {
    return null;
  }

  if (!items || items.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>
          <div className="text-center text-gray-500 py-8">
            No invoice items found
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalTax = items.reduce((sum, item) => sum + (item.tax_amount || 0), 0);
  const total = subtotal + totalTax;

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Quantity</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Unit Price</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Tax Rate</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Tax</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {item.name || 'Unnamed Item'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {item.quantity?.toFixed(2) || '0.00'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {formatCurrency(item.unit_price || 0)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {formatPercentage(item.tax_rate || 1)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {formatCurrency(item.amount || 0)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {formatCurrency(item.tax_amount || 0)}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.amount + item.tax_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200">
                <td colSpan={4} className="py-3 px-4 text-right font-medium text-gray-700">
                  Subtotal:
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  {formatCurrency(subtotal)}
                </td>
                <td className="py-3 px-4 text-right font-medium text-gray-900">
                  {formatCurrency(totalTax)}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-lg text-gray-900">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceItemsTable; 