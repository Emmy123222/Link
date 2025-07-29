import React from "react"

export type BusinessItemProps = {
  name: string
  address: string
  email: string
  onClick?: () => void
}

export const BusinessItem: React.FC<BusinessItemProps> = ({ name, address, email, onClick }) => (
  <li className="p-1 m-1 border rounded-md">
    <a
      href="#"
      onClick={onClick}
      className="text-green-700 font-medium hover:underline block"
    >
      {name}
    </a>
    <div className="text-sm text-gray-800">{address}</div>
    <div className="text-xs text-gray-500">{email}</div>
  </li>
) 