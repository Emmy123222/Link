import React from 'react';
import Modal from './Modal';
import { Button } from './button';

interface PaymentConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onSend: () => void;
}

export default function PaymentConfirmModal({ open, onClose, onSaveDraft, onSend }: PaymentConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} >
      <div className="flex flex-col items-center gap-6">
        <div className="text-lg font-medium text-center">
          Do you want to send the invoice to your customer or save it as a draft?
        </div>
        <div className="flex gap-4 mt-2">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-lg border border-gray-300"
            onClick={() => { onSaveDraft(); onClose(); }}
          >
            Save as draft
          </Button>
          <Button
            variant="primary"
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            onClick={() => { onSend(); onClose(); }}
          >
            Send to customer
          </Button>
        </div>
      </div>
    </Modal>
  );
} 