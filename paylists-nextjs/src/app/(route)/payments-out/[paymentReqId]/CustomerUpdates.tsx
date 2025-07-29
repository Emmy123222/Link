import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useUpdatePaymentRequestForVendor } from '@/hooks/use-payment';
import { customerUpdatesSchema, CustomerUpdatesFormValues } from '@/lib/validations/customer-updates';
import { Switch, SwitchIcons } from '@/components/ui/switch';
import { removeNullish } from "@/utils/utils";

const CustomerUpdates = ({ paymentRequest }: { paymentRequest: any }) => {
  const { mutateAsync: updatePaymentRequestForVendor } = useUpdatePaymentRequestForVendor();
  const [paid, setPaid] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerUpdatesFormValues>({
    resolver: zodResolver(customerUpdatesSchema),
    defaultValues: {
      plan_due_date: paymentRequest?.plan_due_date ? moment(paymentRequest.plan_due_date).format('YYYY-MM-DD') : moment().add(1, 'month').format('YYYY-MM-DD'),
      payment_method: paymentRequest?.payment_method || '',
    },
  });

  const onSubmit = async (data: CustomerUpdatesFormValues) => {
    try {
      await updatePaymentRequestForVendor({
        paymentRequestId: paymentRequest?.id as string,
        updates: removeNullish({ ...data, payment_done: paid, plan_due_date: data.plan_due_date }),
      });
    } catch (error) {
      console.error('Error updating payment request:', error);
    }
  };

  const paymentMethodOptions = [
    { label: 'Open banking', value: 'Open banking' },
    { label: 'Debit / Credit Card', value: 'Debit / Credit Card' },
    { label: 'Bank transfer', value: 'Bank transfer' },
    { label: 'Cash', value: 'Cash' },
    { label: 'Cheque', value: 'Cheque' }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4 text-gray-800">Update your vendor</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <Input
              label="Plan due date"
              type="date"
              {...register("plan_due_date")}
              error={errors.plan_due_date?.message}
            />
            <Select
              label="Payment method"
              options={paymentMethodOptions}
              {...register("payment_method")}
              error={errors.payment_method?.message}
            />
            <Switch
              label="Payment done"
              checked={paid}
              showIcon={true}
              iconOn={<SwitchIcons.Check />}
              iconOff={<SwitchIcons.X />}
              variant="success"
              onChange={(checked: boolean) => {
                setPaid(checked);
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              colorSchema="green"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerUpdates; 