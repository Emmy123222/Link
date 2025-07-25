// import React, { useState, useCallback, useMemo } from 'react';
// import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from './table';
// import { Button } from './button';
// import { Input } from './input';
// import Modal from './Modal';
// import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaEye } from 'react-icons/fa';
// import { toast } from 'sonner';

// // Types
// export interface DataTableColumn<T = any> {
//   key: keyof T | string;
//   label: string;
//   type?: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'custom';
//   required?: boolean;
//   validation?: (value: any) => string | undefined;
//   options?: { label: string; value: any }[];
//   render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
//   editRender?: (value: any, row: T, rowIndex: number, onChange: (value: any) => void) => React.ReactNode;
//   className?: string;
//   width?: string;
//   sortable?: boolean;
//   searchable?: boolean;
// }

// export interface DataTableProps<T = any> {
//   data: T[];
//   columns: DataTableColumn<T>[];
//   onCreate?: (data: Partial<T>) => Promise<void>;
//   onUpdate?: (id: string | number, data: Partial<T>) => Promise<void>;
//   onDelete?: (id: string | number) => Promise<void>;
//   onView?: (row: T) => void;
//   getRowId: (row: T) => string | number;
//   title?: string;
//   emptyText?: string;
//   loading?: boolean;
//   error?: string;
//   searchable?: boolean;
//   sortable?: boolean;
//   pagination?: {
//     page: number;
//     pageSize: number;
//     total: number;
//     onPageChange: (page: number) => void;
//     onPageSizeChange: (pageSize: number) => void;
//   };
//   actions?: {
//     showCreate?: boolean;
//     showEdit?: boolean;
//     showDelete?: boolean;
//     showView?: boolean;
//     customActions?: (row: T) => React.ReactNode;
//   };
//   formMode?: 'modal' | 'inline';
//   className?: string;
//   rowClassName?: (row: T, index: number) => string;
// }

// export interface DataTableState<T = any> {
//   editingRow: string | number | null;
//   editingData: Partial<T>;
//   showCreateModal: boolean;
//   showEditModal: string | number | null;
//   showDeleteModal: string | number | null;
//   searchTerm: string;
//   sortColumn: keyof T | null;
//   sortDirection: 'asc' | 'desc';
// }

// export function DataTable<T extends Record<string, any>>({
//   data,
//   columns,
//   onCreate,
//   onUpdate,
//   onDelete,
//   onView,
//   getRowId,
//   title,
//   emptyText = "No records found",
//   loading = false,
//   error,
//   searchable = true,
//   sortable = true,
//   pagination,
//   actions = {
//     showCreate: true,
//     showEdit: true,
//     showDelete: true,
//     showView: false,
//   },
//   formMode = 'modal',
//   className = '',
//   rowClassName,
// }: DataTableProps<T>) {
//   const [state, setState] = useState<DataTableState<T>>({
//     editingRow: null,
//     editingData: {},
//     showCreateModal: false,
//     showEditModal: null,
//     showDeleteModal: null,
//     searchTerm: '',
//     sortColumn: null,
//     sortDirection: 'asc',
//   });

//   // Filter and sort data
//   const filteredAndSortedData = useMemo(() => {
//     let result = [...data];

//     // Apply search filter
//     if (state.searchTerm && searchable) {
//       const searchableColumns = columns.filter(col => col.searchable !== false);
//       result = result.filter(row =>
//         searchableColumns.some(col => {
//           const value = row[col.key as keyof T];
//           return value?.toString().toLowerCase().includes(state.searchTerm.toLowerCase());
//         })
//       );
//     }

//     // Apply sorting
//     if (state.sortColumn && sortable) {
//       result.sort((a, b) => {
//         const aValue = a[state.sortColumn as keyof T];
//         const bValue = b[state.sortColumn as keyof T];

//         if (aValue < bValue) return state.sortDirection === 'asc' ? -1 : 1;
//         if (aValue > bValue) return state.sortDirection === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return result;
//   }, [data, state.searchTerm, state.sortColumn, state.sortDirection, columns, searchable, sortable]);

//   // Handle sorting
//   const handleSort = useCallback((columnKey: keyof T) => {
//     setState(prev => ({
//       ...prev,
//       sortColumn: columnKey,
//       sortDirection: prev.sortColumn === columnKey && prev.sortDirection === 'asc' ? 'desc' : 'asc',
//     }));
//   }, []);

//   // Handle inline editing
//   const startInlineEdit = useCallback((row: T) => {
//     setState(prev => ({
//       ...prev,
//       editingRow: getRowId(row),
//       editingData: { ...row },
//     }));
//   }, [getRowId]);

//   const cancelInlineEdit = useCallback(() => {
//     setState(prev => ({
//       ...prev,
//       editingRow: null,
//       editingData: {},
//     }));
//   }, []);

//   const saveInlineEdit = useCallback(async () => {
//     if (!onUpdate) return;

//     try {
//       await onUpdate(state.editingRow!, state.editingData);
//       setState(prev => ({
//         ...prev,
//         editingRow: null,
//         editingData: {},
//       }));
//       toast.success('Record updated successfully');
//     } catch (error) {
//       toast.error('Failed to update record');
//     }
//   }, [onUpdate, state.editingRow, state.editingData]);

//   // Handle modal forms
//   const openCreateModal = useCallback(() => {
//     setState(prev => ({ ...prev, showCreateModal: true }));
//   }, []);

//   const closeCreateModal = useCallback(() => {
//     setState(prev => ({ ...prev, showCreateModal: false }));
//   }, []);

//   const openEditModal = useCallback((row: T) => {
//     setState(prev => ({
//       ...prev,
//       showEditModal: getRowId(row),
//       editingData: { ...row },
//     }));
//   }, [getRowId]);

//   const closeEditModal = useCallback(() => {
//     setState(prev => ({ ...prev, showEditModal: null, editingData: {} }));
//   }, []);

//   const openDeleteModal = useCallback((row: T) => {
//     setState(prev => ({ ...prev, showDeleteModal: getRowId(row) }));
//   }, [getRowId]);

//   const closeDeleteModal = useCallback(() => {
//     setState(prev => ({ ...prev, showDeleteModal: null }));
//   }, []);

//   // Handle form submission
//   const handleCreate = useCallback(async (formData: Partial<T>) => {
//     if (!onCreate) return;

//     try {
//       await onCreate(formData);
//       closeCreateModal();
//       toast.success('Record created successfully');
//     } catch (error) {
//       toast.error('Failed to create record');
//     }
//   }, [onCreate, closeCreateModal]);

//   const handleUpdate = useCallback(async (formData: Partial<T>) => {
//     if (!onUpdate) return;

//     try {
//       await onUpdate(state.showEditModal!, formData);
//       closeEditModal();
//       toast.success('Record updated successfully');
//     } catch (error) {
//       toast.error('Failed to update record');
//     }
//   }, [onUpdate, state.showEditModal, closeEditModal]);

//   const handleDelete = useCallback(async () => {
//     if (!onDelete) return;

//     try {
//       await onDelete(state.showDeleteModal!);
//       closeDeleteModal();
//       toast.success('Record deleted successfully');
//     } catch (error) {
//       toast.error('Failed to delete record');
//     }
//   }, [onDelete, state.showDeleteModal, closeDeleteModal]);

//   // Render form field
//   const renderFormField = useCallback((
//     column: DataTableColumn<T>,
//     value: any,
//     onChange: (value: any) => void,
//     isEditing: boolean = false
//   ) => {
//     if (column.editRender) {
//       return column.editRender(value, {} as T, 0, onChange);
//     }

//     const commonProps = {
//       value: value || '',
//       onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const newValue = column.type === 'number' ? Number(e.target.value) : e.target.value;
//         onChange(newValue);
//       },
//       className: 'w-full',
//       required: column.required,
//     };

//     switch (column.type) {
//       case 'textarea':
//         return (
//           <textarea
//             {...commonProps}
//             rows={3}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500/20"
//           />
//         );
//       case 'select':
//         return (
//           <select
//             {...commonProps}
//             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500/20"
//           >
//             <option value="">Select...</option>
//             {column.options?.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );
//       case 'date':
//         return (
//           <Input
//             {...commonProps}
//             type="date"
//             label={isEditing ? column.label : undefined}
//           />
//         );
//       case 'email':
//         return (
//           <Input
//             {...commonProps}
//             type="email"
//             label={isEditing ? column.label : undefined}
//           />
//         );
//       case 'number':
//         return (
//           <Input
//             {...commonProps}
//             type="number"
//             label={isEditing ? column.label : undefined}
//           />
//         );
//       default:
//         return (
//           <Input
//             {...commonProps}
//             type="text"
//             label={isEditing ? column.label : undefined}
//           />
//         );
//     }
//   }, []);

//   // Render modal form
//   const renderModalForm = useCallback((
//     mode: 'create' | 'edit',
//     initialData: Partial<T> = {},
//     onSubmit: (data: Partial<T>) => void
//   ) => {
//     const [formData, setFormData] = useState<Partial<T>>(initialData);

//     const handleSubmit = (e: React.FormEvent) => {
//       e.preventDefault();
//       onSubmit(formData);
//     };

//     const updateFormData = (key: keyof T, value: any) => {
//       setFormData(prev => ({ ...prev, [key]: value }));
//     };

//     return (
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {columns.map(column => (
//           <div key={String(column.key)}>
//             {renderFormField(
//               column,
//               formData[column.key as keyof T],
//               (value) => updateFormData(column.key as keyof T, value),
//               true
//             )}
//           </div>
//         ))}
//         <div className="flex justify-end gap-2 pt-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={mode === 'create' ? closeCreateModal : closeEditModal}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" colorSchema="green">
//             {mode === 'create' ? 'Create' : 'Update'}
//           </Button>
//         </div>
//       </form>
//     );
//   }, [columns, renderFormField, closeCreateModal, closeEditModal]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-500 p-4">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className={`bg-white rounded-lg shadow-sm ${className}`}>
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2">
//             {searchable && (
//               <Input
//                 placeholder="Search..."
//                 value={state.searchTerm}
//                 onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
//                 className="w-full sm:w-64"
//               />
//             )}
//             {actions.showCreate && (
//               <Button onClick={openCreateModal} colorSchema="green">
//                 <FaPlus className="mr-2" />
//                 Add New
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-green-50">
//               {columns.map(column => (
//                 <TableHead
//                   key={String(column.key)}
//                   className={`px-4 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap ${column.className || ''}`}
//                   style={{ width: column.width }}
//                   onClick={() => column.sortable && handleSort(column.key as keyof T)}
//                 >
//                   <div className="flex items-center gap-1">
//                     {column.label}
//                     {column.sortable && (
//                       <span className="text-gray-400">
//                         {state.sortColumn === column.key ? (
//                           state.sortDirection === 'asc' ? '↑' : '↓'
//                         ) : '↕'}
//                       </span>
//                     )}
//                   </div>
//                 </TableHead>
//               ))}
//               {(actions.showEdit || actions.showDelete || actions.showView || actions.customActions) && (
//                 <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-600 whitespace-nowrap w-32">
//                   Actions
//                 </TableHead>
//               )}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredAndSortedData.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={columns.length + (actions.showEdit || actions.showDelete || actions.showView || actions.customActions ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
//                   {emptyText}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredAndSortedData.map((row, rowIndex) => {
//                 const rowId = getRowId(row);
//                 const isEditing = state.editingRow === rowId;

//                 return (
//                   <TableRow
//                     key={rowId}
//                     className={`hover:bg-green-50 transition-colors ${rowClassName ? rowClassName(row, rowIndex) : ''}`}
//                   >
//                     {columns.map(column => (
//                       <TableCell key={String(column.key)} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                         {isEditing && formMode === 'inline' ? (
//                           renderFormField(
//                             column,
//                             state.editingData[column.key as keyof T],
//                             (value) => setState(prev => ({
//                               ...prev,
//                               editingData: { ...prev.editingData, [column.key]: value }
//                             }))
//                           )
//                         ) : (
//                           column.render
//                             ? column.render(row[column.key as keyof T], row, rowIndex)
//                             : (row[column.key as keyof T] as React.ReactNode)
//                         )}
//                       </TableCell>
//                     ))}
//                     {(actions.showEdit || actions.showDelete || actions.showView || actions.customActions) && (
//                       <TableCell className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           {isEditing && formMode === 'inline' ? (
//                             <>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 colorSchema="green"
//                                 onClick={saveInlineEdit}
//                               >
//                                 <FaSave />
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 colorSchema="gray"
//                                 onClick={cancelInlineEdit}
//                               >
//                                 <FaTimes />
//                               </Button>
//                             </>
//                           ) : (
//                             <>
//                               {actions.showView && onView && (
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   colorSchema="blue"
//                                   onClick={() => onView(row)}
//                                 >
//                                   <FaEye />
//                                 </Button>
//                               )}
//                               {actions.showEdit && (
//                                 formMode === 'inline' ? (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     colorSchema="green"
//                                     onClick={() => startInlineEdit(row)}
//                                   >
//                                     <FaEdit />
//                                   </Button>
//                                 ) : (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     colorSchema="green"
//                                     onClick={() => openEditModal(row)}
//                                   >
//                                     <FaEdit />
//                                   </Button>
//                                 )
//                               )}
//                               {actions.showDelete && (
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   colorSchema="red"
//                                   onClick={() => openDeleteModal(row)}
//                                 >
//                                   <FaTrash />
//                                 </Button>
//                               )}
//                               {actions.customActions && actions.customActions(row)}
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       {pagination && (
//         <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
//             {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
//             {pagination.total} results
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => pagination.onPageChange(pagination.page - 1)}
//               disabled={pagination.page <= 1}
//             >
//               Previous
//             </Button>
//             <span className="text-sm text-gray-700">
//               Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
//             </span>
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={() => pagination.onPageChange(pagination.page + 1)}
//               disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {state.showCreateModal && (
//         <Modal
//           open={state.showCreateModal}
//           onClose={closeCreateModal}
//           title="Create New Record"
//         >
//           {renderModalForm('create', {}, handleCreate)}
//         </Modal>
//       )}

//       {state.showEditModal && (
//         <Modal
//           open={!!state.showEditModal}
//           onClose={closeEditModal}
//           title="Edit Record"
//         >
//           {renderModalForm('edit', state.editingData, handleUpdate)}
//         </Modal>
//       )}

//       {state.showDeleteModal && (
//         <Modal
//           open={!!state.showDeleteModal}
//           onClose={closeDeleteModal}
//           title="Confirm Delete"
//         >
//           <div className="space-y-4">
//             <p className="text-gray-700">
//               Are you sure you want to delete this record? This action cannot be undone.
//             </p>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={closeDeleteModal}>
//                 Cancel
//               </Button>
//               <Button colorSchema="red" onClick={handleDelete}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }
