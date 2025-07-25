// import React, { useState } from 'react';
// import { DataTable, DataTableColumn } from './DataTable';
// import { Badge } from './badge';
// import { Button } from './button';
// import { FaDownload, FaEye } from 'react-icons/fa';

// // Example data types
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'user' | 'moderator';
//   status: 'active' | 'inactive' | 'pending';
//   createdAt: string;
//   lastLogin: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   description: string;
//   isActive: boolean;
// }

// // Example data
// const sampleUsers: User[] = [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com',
//     role: 'admin',
//     status: 'active',
//     createdAt: '2024-01-15',
//     lastLogin: '2024-01-20',
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     role: 'user',
//     status: 'active',
//     createdAt: '2024-01-10',
//     lastLogin: '2024-01-19',
//   },
//   {
//     id: 3,
//     name: 'Bob Johnson',
//     email: 'bob@example.com',
//     role: 'moderator',
//     status: 'pending',
//     createdAt: '2024-01-05',
//     lastLogin: '2024-01-18',
//   },
// ];

// const sampleProducts: Product[] = [
//   {
//     id: 'PROD-001',
//     name: 'Laptop',
//     category: 'Electronics',
//     price: 999.99,
//     stock: 50,
//     description: 'High-performance laptop',
//     isActive: true,
//   },
//   {
//     id: 'PROD-002',
//     name: 'Mouse',
//     category: 'Electronics',
//     price: 29.99,
//     stock: 100,
//     description: 'Wireless mouse',
//     isActive: true,
//   },
//   {
//     id: 'PROD-003',
//     name: 'Keyboard',
//     category: 'Electronics',
//     price: 79.99,
//     stock: 25,
//     description: 'Mechanical keyboard',
//     isActive: false,
//   },
// ];

// // Example 1: Basic DataTable with CRUD operations
// export function BasicDataTableExample() {
//   const [users, setUsers] = useState<User[]>(sampleUsers);

//   const columns: DataTableColumn<User>[] = [
//     {
//       key: 'id',
//       label: 'ID',
//       type: 'number',
//       width: '80px',
//       sortable: true,
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       type: 'text',
//       required: true,
//       searchable: true,
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       type: 'email',
//       required: true,
//       searchable: true,
//     },
//     {
//       key: 'role',
//       label: 'Role',
//       type: 'select',
//       options: [
//         { label: 'Admin', value: 'admin' },
//         { label: 'User', value: 'user' },
//         { label: 'Moderator', value: 'moderator' },
//       ],
//       render: (value) => (
//         <Badge variant="outline" color={value === 'admin' ? 'red' : value === 'moderator' ? 'yellow' : 'green'}>
//           {value}
//         </Badge>
//       ),
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       type: 'select',
//       options: [
//         { label: 'Active', value: 'active' },
//         { label: 'Inactive', value: 'inactive' },
//         { label: 'Pending', value: 'pending' },
//       ],
//       render: (value) => (
//         <Badge variant="outline" color={value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'error'}>
//           {value}
//         </Badge>
//       ),
//     },
//     {
//       key: 'createdAt',
//       label: 'Created At',
//       type: 'date',
//       sortable: true,
//     },
//     {
//       key: 'lastLogin',
//       label: 'Last Login',
//       type: 'date',
//       sortable: true,
//     },
//   ];

//   const handleCreate = async (data: Partial<User>) => {
//     // Simulate API call
//     const newUser: User = {
//       id: Math.max(...users.map(u => u.id)) + 1,
//       name: data.name || '',
//       email: data.email || '',
//       role: data.role || 'user',
//       status: data.status || 'pending',
//       createdAt: new Date().toISOString().split('T')[0],
//       lastLogin: new Date().toISOString().split('T')[0],
//     };
//     setUsers(prev => [...prev, newUser]);
//   };

//   const handleUpdate = async (id: string | number, data: Partial<User>) => {
//     setUsers(prev => prev.map(user => user.id === id ? { ...user, ...data } : user));
//   };

//   const handleDelete = async (id: string | number) => {
//     setUsers(prev => prev.filter(user => user.id !== id));
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Basic DataTable Example</h2>
//       <DataTable
//         data={users}
//         columns={columns}
//         onCreate={handleCreate}
//         onUpdate={handleUpdate}
//         onDelete={handleDelete}
//         getRowId={(row) => row.id}
//         title="Users Management"
//         searchable={true}
//         sortable={true}
//         formMode="modal"
//       />
//     </div>
//   );
// }

// // Example 2: Inline Editing DataTable
// export function InlineEditingDataTableExample() {
//   const [products, setProducts] = useState<Product[]>(sampleProducts);

//   const columns: DataTableColumn<Product>[] = [
//     {
//       key: 'id',
//       label: 'Product ID',
//       type: 'text',
//       width: '120px',
//       searchable: true,
//     },
//     {
//       key: 'name',
//       label: 'Product Name',
//       type: 'text',
//       required: true,
//       searchable: true,
//     },
//     {
//       key: 'category',
//       label: 'Category',
//       type: 'select',
//       options: [
//         { label: 'Electronics', value: 'Electronics' },
//         { label: 'Clothing', value: 'Clothing' },
//         { label: 'Books', value: 'Books' },
//         { label: 'Home & Garden', value: 'Home & Garden' },
//       ],
//       searchable: true,
//     },
//     {
//       key: 'price',
//       label: 'Price',
//       type: 'number',
//       required: true,
//       render: (value) => `$${value.toFixed(2)}`,
//       sortable: true,
//     },
//     {
//       key: 'stock',
//       label: 'Stock',
//       type: 'number',
//       required: true,
//       render: (value) => (
//         <span className={value < 10 ? 'text-red-600 font-semibold' : ''}>
//           {value} units
//         </span>
//       ),
//       sortable: true,
//     },
//     {
//       key: 'description',
//       label: 'Description',
//       type: 'textarea',
//       render: (value) => (
//         <div className="max-w-xs truncate" title={value}>
//           {value}
//         </div>
//       ),
//     },
//     {
//       key: 'isActive',
//       label: 'Active',
//       type: 'select',
//       options: [
//         { label: 'Yes', value: true },
//         { label: 'No', value: false },
//       ],
//       render: (value) => (
//         <Badge variant="outline" color={value ? 'success' : 'error'}>
//           {value ? 'Active' : 'Inactive'}
//         </Badge>
//       ),
//     },
//   ];

//   const handleCreate = async (data: Partial<Product>) => {
//     const newProduct: Product = {
//       id: `PROD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
//       name: data.name || '',
//       category: data.category || 'Electronics',
//       price: data.price || 0,
//       stock: data.stock || 0,
//       description: data.description || '',
//       isActive: data.isActive !== undefined ? data.isActive : true,
//     };
//     setProducts(prev => [...prev, newProduct]);
//   };

//   const handleUpdate = async (id: string | number, data: Partial<Product>) => {
//     setProducts(prev => prev.map(product => product.id === id ? { ...product, ...data } : product));
//   };

//   const handleDelete = async (id: string | number) => {
//     setProducts(prev => prev.filter(product => product.id !== id));
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Inline Editing DataTable Example</h2>
//       <DataTable
//         data={products}
//         columns={columns}
//         onCreate={handleCreate}
//         onUpdate={handleUpdate}
//         onDelete={handleDelete}
//         getRowId={(row) => row.id}
//         title="Product Inventory"
//         searchable={true}
//         sortable={true}
//         formMode="inline"
//         actions={{
//           showCreate: true,
//           showEdit: true,
//           showDelete: true,
//           showView: false,
//         }}
//       />
//     </div>
//   );
// }

// // Example 3: DataTable with Custom Actions and Pagination
// export function AdvancedDataTableExample() {
//   const [users, setUsers] = useState<User[]>(sampleUsers);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const columns: DataTableColumn<User>[] = [
//     {
//       key: 'id',
//       label: 'ID',
//       type: 'number',
//       width: '80px',
//       sortable: true,
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       type: 'text',
//       required: true,
//       searchable: true,
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       type: 'email',
//       required: true,
//       searchable: true,
//     },
//     {
//       key: 'role',
//       label: 'Role',
//       type: 'select',
//       options: [
//         { label: 'Admin', value: 'admin' },
//         { label: 'User', value: 'user' },
//         { label: 'Moderator', value: 'moderator' },
//       ],
//       render: (value) => (
//         <Badge variant="outline" color={value === 'admin' ? 'red' : value === 'moderator' ? 'yellow' : 'green'}>
//           {value}
//         </Badge>
//       ),
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       type: 'select',
//       options: [
//         { label: 'Active', value: 'active' },
//         { label: 'Inactive', value: 'inactive' },
//         { label: 'Pending', value: 'pending' },
//       ],
//       render: (value) => (
//         <Badge variant="outline" color={value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'error'}>
//           {value}
//         </Badge>
//       ),
//     },
//   ];

//   const handleCreate = async (data: Partial<User>) => {
//     const newUser: User = {
//       id: Math.max(...users.map(u => u.id)) + 1,
//       name: data.name || '',
//       email: data.email || '',
//       role: data.role || 'user',
//       status: data.status || 'pending',
//       createdAt: new Date().toISOString().split('T')[0],
//       lastLogin: new Date().toISOString().split('T')[0],
//     };
//     setUsers(prev => [...prev, newUser]);
//   };

//   const handleUpdate = async (id: string | number, data: Partial<User>) => {
//     setUsers(prev => prev.map(user => user.id === id ? { ...user, ...data } : user));
//   };

//   const handleDelete = async (id: string | number) => {
//     setUsers(prev => prev.filter(user => user.id !== id));
//   };

//   const handleView = (user: User) => {
//     alert(`Viewing user: ${user.name} (${user.email})`);
//   };

//   const customActions = (user: User) => (
//     <>
//       <Button
//         size="sm"
//         variant="outline"
//         colorSchema="blue"
//         onClick={() => handleView(user)}
//       >
//         <FaEye />
//       </Button>
//       <Button
//         size="sm"
//         variant="outline"
//         colorSchema="purple"
//         onClick={() => alert(`Downloading data for ${user.name}`)}
//       >
//         <FaDownload />
//       </Button>
//     </>
//   );

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Advanced DataTable Example</h2>
//       <DataTable
//         data={users}
//         columns={columns}
//         onCreate={handleCreate}
//         onUpdate={handleUpdate}
//         onDelete={handleDelete}
//         onView={handleView}
//         getRowId={(row) => row.id}
//         title="Advanced Users Management"
//         searchable={true}
//         sortable={true}
//         formMode="modal"
//         actions={{
//           showCreate: true,
//           showEdit: true,
//           showDelete: true,
//           showView: true,
//           customActions,
//         }}
//         pagination={{
//           page: currentPage,
//           pageSize,
//           total: users.length,
//           onPageChange: setCurrentPage,
//           onPageSizeChange: setPageSize,
//         }}
//       />
//     </div>
//   );
// }

// // Example 4: Read-only DataTable
// export function ReadOnlyDataTableExample() {
//   const columns: DataTableColumn<User>[] = [
//     {
//       key: 'id',
//       label: 'ID',
//       type: 'number',
//       width: '80px',
//       sortable: true,
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       type: 'text',
//       searchable: true,
//     },
//     {
//       key: 'email',
//       label: 'Email',
//       type: 'email',
//       searchable: true,
//     },
//     {
//       key: 'role',
//       label: 'Role',
//       render: (value) => (
//         <Badge variant="outline" color={value === 'admin' ? 'red' : value === 'moderator' ? 'yellow' : 'green'}>
//           {value}
//         </Badge>
//       ),
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       render: (value) => (
//         <Badge variant="outline" color={value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'error'}>
//           {value}
//         </Badge>
//       ),
//     },
//     {
//       key: 'createdAt',
//       label: 'Created At',
//       type: 'date',
//       sortable: true,
//     },
//   ];

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Read-only DataTable Example</h2>
//       <DataTable
//         data={sampleUsers}
//         columns={columns}
//         getRowId={(row) => row.id}
//         title="User Directory"
//         searchable={true}
//         sortable={true}
//         actions={{
//           showCreate: false,
//           showEdit: false,
//           showDelete: false,
//           showView: true,
//         }}
//       />
//     </div>
//   );
// }

// // Main example component that shows all examples
// export default function DataTableExamples() {
//   return (
//     <div className="space-y-12">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-4">DataTable Component Examples</h1>
//         <p className="text-lg text-gray-600">
//           Comprehensive examples of the reusable and scalable DataTable component
//         </p>
//       </div>

//       <BasicDataTableExample />
//       <InlineEditingDataTableExample />
//       <AdvancedDataTableExample />
//       <ReadOnlyDataTableExample />
//     </div>
//   );
// } 