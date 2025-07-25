import React, { Fragment } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
        aria-label="Close modal"
      />
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 min-w-[320px] max-w-sm mx-4 animate-fadeIn">
        {title && <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
} 