import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUploadPDF } from '@/hooks/use-payment';
import { useSendLetter, useSendLateLetter } from '@/hooks/use-payment';
import { Document, Page, Text, View, StyleSheet, Link, PDFViewer, pdf } from '@react-pdf/renderer';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useGetPaymentRequest } from '@/hooks/use-payment';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 16, marginBottom: 10, textAlign: 'right' },
  title: { fontSize: 22, textAlign: 'center', marginVertical: 10, textDecoration: 'underline', fontWeight: 'bold' },
  section: { marginVertical: 10 },
  bold: { fontWeight: 'bold' },
  red: { color: 'red' },
  link: { color: 'blue', textDecoration: 'underline' },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    flexGrow: 1,
  },
  headerCell: {
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    flexGrow: 1,
    backgroundColor: '#eee',
    fontWeight: 'bold',
  },
});
interface PaymentLetterModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  customer: any;
  letterType: string;
}

const LetterDocument = ({ customer }: { customer: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>{customer.vendor?.business_name || "*** Business name is missing ***"}</Text>
        <Text>{customer.vendor?.street_1 || "*** Street is missing ***"}</Text>
        <Text>{customer.vendor?.city}, {customer.vendor?.country.countryName}, {customer.vendor?.postal_code}</Text>
        <Text>Date: {moment().format("DD/MM/YYYY")}</Text>
      </View>

      <View>
        <Text>To:</Text>
        <Text>{customer.customer?.business_name || "*** Customer name is missing ***"}</Text>
        <Text>{customer.customer?.street_1 || "*** Street is missing ***"}</Text>
        <Text>{customer.customer?.city}, {customer.customer?.country?.countryName}, {customer.customer?.postal_code}</Text>
        <Text>{customer.customer?.email || "*** Email is missing ***"}</Text>
      </View>

      <Text style={styles.title}>A gentle reminder</Text>

      <View style={styles.section}>
        <Text>
          According to our records there is a payment for the amount of{" "}
          <Text style={styles.bold}>{customer.amount} {customer.currency}</Text> which is supposed to be paid up to{" "}
          <Text style={styles.bold}>{moment(customer.due_date).format("DD/MM/YYYY")}</Text>:
        </Text>
      </View>

      <View>
        <Text style={styles.bold}>Payment description</Text>
        <Text>Payment reference: {customer.requestId}</Text>
        <Text>Request date: {moment(customer.request_date).format("DD/MM/YYYY")}</Text>
        <Text>Supply date: {moment(customer.supply_date).format("DD/MM/YYYY")}</Text>
        <Text>Due date: {moment(customer.due_date).format("DD/MM/YYYY")}</Text>
      </View>

      <View style={styles.section}>
        <Text>Please make sure to settle up the payment until {moment(customer.due_date).format("DD/MM/YYYY")}.</Text>
        <Text>
          <Link src={customer.requestLink} style={styles.link}>Click here to pay now</Link>{" "}
          or make a bank transfer to the following bank details:
        </Text>
        {customer.vendor?.bank_account_name ? (
          <>
            <Text>Bank account name: {customer.vendor?.bank_account_name || "*** Bank account name is missing ***"}</Text>
            <Text>Bank account number: {customer.vendor?.bank_account_number || "*** Bank account number is missing ***"}</Text>
            <Text>Bank account sort code: {customer.vendor?.sort_code || "*** Bank account sort code is missing ***"}</Text>
          </>
        ) : (
          <Text style={styles.red}>*** Bank details are missing ***</Text>
        )}
      </View>
      {customer.items?.length > 0 && (
        <View style={styles.section}>
          <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Items Breakdown</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.row}>
              <Text style={styles.cell}>Item</Text>
              <Text style={styles.cell}>Quantity</Text>
              <Text style={styles.cell}>Unit Price</Text>
              <Text style={styles.cell}>Tax Rate</Text>
              <Text style={styles.cell}>Amount</Text>
              <Text style={styles.cell}>Tax Amount</Text>
              <Text style={styles.cell}>Total</Text>
            </View>

            {/* Table Rows */}
            {customer.items.map((item: any, idx: number) => (
              <View style={styles.row} key={item.id || idx}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>{item.unit_price} {customer.currency}</Text>
                <Text style={styles.cell}>{item.tax_rate}</Text>
                <Text style={styles.cell}>{item.amount} {customer.currency}</Text>
                <Text style={styles.cell}>{item.tax_amount} {customer.currency}</Text>
                <Text style={styles.cell}>{item.amount + item.tax_amount} {customer.currency}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View>
        <Text>If you have already arranged this payment, consider this message cancelled.</Text>
      </View>

      <View style={styles.section}>
        <Text>Thanks</Text>
        <Text>{customer.vendor?.business_name || "*** Business name is missing ***"}</Text>
        <Text>{customer.vendor?.street_1 || "*** Street is missing ***"}</Text>
        <Text>{customer.vendor?.city}, {customer.vendor?.country?.countryName}, {customer.vendor?.postal_code}</Text>
      </View>
    </Page>
  </Document>
);

const LateLetterDocument = ({ customer }: { customer: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>{customer.vendor?.business_name || "*** Business name is missing ***"}</Text>
        <Text>{customer.vendor?.street_1 || "*** Street is missing ***"}</Text>
        <Text>{customer.vendor?.city}, {customer.vendor?.country.countryName}, {customer.vendor?.postal_code}</Text>
        <Text>Date: {moment().format("DD/MM/YYYY")}</Text>
      </View>

      <View>
        <Text>To:</Text>
        <Text>{customer.customer?.business_name || "*** Customer name is missing ***"}</Text>
        <Text>{customer.customer?.street_1 || "*** Street is missing ***"}</Text>
        <Text>{customer.customer?.city}, {customer.customer?.country?.countryName}, {customer.customer?.postal_code}</Text>
        <Text>{customer.customer?.email || "*** Email is missing ***"}</Text>
      </View>

      <Text style={{ ...styles.title, color: 'red' }}>Letter Before Action</Text>

      <View style={styles.section}>
        <Text>
          According to our records there is a payment for the amount of{" "}
          <Text style={styles.bold}>{customer.amount} {customer.currency}</Text> which is supposed to be paid up to{" "}
          <Text style={styles.bold}>{moment(customer.due_date).format("DD/MM/YYYY")}</Text>:
        </Text>
      </View>

      <View>
        <Text style={styles.bold}>Payment description</Text>
        <Text>Payment reference: {customer.requestId}</Text>
        <Text>Request date: {moment(customer.request_date).format("DD/MM/YYYY")}</Text>
        <Text>Supply date: {moment(customer.supply_date).format("DD/MM/YYYY")}</Text>
        <Text>Due date: {moment(customer.due_date).format("DD/MM/YYYY")}</Text>
      </View>

      <View style={styles.section}>
        <Text>Please make sure to settle up the payment until {moment(customer.due_date).format("DD/MM/YYYY")}.</Text>
        <Text>
          <Link src={customer.requestLink} style={styles.link}>Click here to pay now</Link>{" "}
          or make a bank transfer to the following bank details:
        </Text>
        {customer.vendor?.bank_account_name ? (
          <>
            <Text>Bank account name: {customer.vendor?.bank_account_name || "*** Bank account name is missing ***"}</Text>
            <Text>Bank account number: {customer.vendor?.bank_account_number || "*** Bank account number is missing ***"}</Text>
            <Text>Bank account sort code: {customer.vendor?.sort_code || "*** Bank account sort code is missing ***"}</Text>
          </>
        ) : (
          <Text style={styles.red}>*** Bank details are missing ***</Text>
        )}
      </View>
      {customer.items?.length > 0 && (
        <View style={styles.section}>
          <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Items Breakdown</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.row}>
              <Text style={styles.cell}>Item</Text>
              <Text style={styles.cell}>Quantity</Text>
              <Text style={styles.cell}>Unit Price</Text>
              <Text style={styles.cell}>Tax Rate</Text>
              <Text style={styles.cell}>Amount</Text>
              <Text style={styles.cell}>Tax Amount</Text>
              <Text style={styles.cell}>Total</Text>
            </View>

            {/* Table Rows */}
            {customer.items.map((item: any, idx: number) => (
              <View style={styles.row} key={item.id || idx}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
                <Text style={styles.cell}>{item.unit_price} {customer.currency}</Text>
                <Text style={styles.cell}>{item.tax_rate}</Text>
                <Text style={styles.cell}>{item.amount} {customer.currency}</Text>
                <Text style={styles.cell}>{item.tax_amount} {customer.currency}</Text>
                <Text style={styles.cell}>{item.amount + item.tax_amount} {customer.currency}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View>
        <Text>If you have already arranged this payment, consider this message cancelled.</Text>
      </View>

      <View style={styles.section}>
        <Text>Thanks</Text>
        <Text>{customer.vendor?.business_name || "*** Business name is missing ***"}</Text>
        <Text>{customer.vendor?.street_1 || "*** Street is missing ***"}</Text>
        <Text>{customer.vendor?.city}, {customer.vendor?.country?.countryName}, {customer.vendor?.postal_code}</Text>
      </View>
    </Page>
  </Document>
);

const PaymentLetterModal = ({ open, onClose, title, customer, letterType }: PaymentLetterModalProps) => {
  if (!open) return null;
  const { mutateAsync: uploadPDF } = useUploadPDF();
  const { mutateAsync: sendLetter } = useSendLetter();
  const { mutateAsync: sendLateLetter } = useSendLateLetter();
  const router = useRouter();
  const { paymentReqId } = useParams();
  const { data: paymentRequestData } = useGetPaymentRequest(paymentReqId as string);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleSendPDFToCustomer = async () => {
    if (paymentRequestData?.vendor?.bank_account_name && paymentRequestData?.vendor?.bank_account_number && paymentRequestData?.vendor?.sort_code) {
      const blob = await pdf(letterType === 'reminder' ? <LetterDocument customer={paymentRequestData} /> : <LateLetterDocument customer={paymentRequestData} />).toBlob();
      const fileName = String(Date.now())
      const res = await uploadPDF({ data: blob, fileName: `${fileName}.pdf` });
      if (res) {
        if (letterType !== 'reminder') {
          await sendLateLetter({
            letterUrl: res,
            letterName: `${fileName}.pdf`,
            debtorDetails: {
              email: paymentRequestData.customer.email,
              business_name: paymentRequestData.customer.business_name,
            },
            requestBusinessDetails: {
              business_name: paymentRequestData.vendor.business_name,
              email: paymentRequestData.vendor.email,
            },
            reqId: paymentReqId,
            businessId: paymentRequestData.vendor.id,
            letterTemplate: "default",
          })
        } else {
          await sendLetter({
            letterUrl: res,
            letterName: `${fileName}.pdf`,
            debtorDetails: {
              email: paymentRequestData.customer.email,
              business_name: paymentRequestData.customer.business_name,
            },
            requestBusinessDetails: {
              business_name: paymentRequestData.vendor.business_name,
              email: paymentRequestData.vendor.email,
            },
            reqId: paymentReqId,
            businessId: paymentRequestData.vendor.id,
            letterTemplate: "default",
          });
        }
        onClose();
      }
    } else {
      router.push(`/business`);
    }
  }

  const handleSendClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSend = () => {
    setShowConfirmModal(false);
    handleSendPDFToCustomer();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative h-[90vh] flex flex-col">
          <div className="flex-1 overflow-auto">
            <PDFViewer width="100%" height="100%" >
              {letterType === 'reminder' ? <LetterDocument customer={paymentRequestData} /> : <LateLetterDocument customer={paymentRequestData} />}
            </PDFViewer>
          </div>

          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              colorSchema="green"
              onClick={() => {
                if (letterType === 'reminder') {
                  handleConfirmSend()
                } else {
                  handleSendClick()
                }
              }}
            >
              Send to Customer
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Send Letter"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-center">
            Legal advice is recommended before sending this type of letter. Do you want to continue?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" colorSchema="green" onClick={handleConfirmSend}>
              Send Letter
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentLetterModal;