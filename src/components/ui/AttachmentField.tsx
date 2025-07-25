import React, { useRef } from 'react';
import { IoMdClose } from 'react-icons/io';

interface AttachmentFieldProps {
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  label?: string;
}

const AttachmentField: React.FC<AttachmentFieldProps> = ({ attachments, setAttachments, label = 'Attachments' }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setAttachments((prev) => [...prev, ...files]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-gray-500">Drag or click to add attachments</span>
      </div>
      {attachments.length > 0 && (
        <div className="mt-2 space-y-1 flex flex-wrap gap-2">
          {attachments.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-100 rounded px-2 py-1 ">
              <span className="truncate max-w-xs text-sm">{file.name}</span>
              <button type="button" className="text-red-500 ml-2" onClick={() => handleRemoveAttachment(idx)}>
                <IoMdClose size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentField; 