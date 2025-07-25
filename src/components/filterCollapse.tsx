"use client"

import { useState, useRef, useEffect } from "react"
import { FiX, FiRotateCcw, FiChevronDown, FiCalendar } from "react-icons/fi"

interface FilterCollapseProps {
	isOpen: boolean
	onClose: () => void
}

export function FilterCollapse({ isOpen, onClose }: FilterCollapseProps) {
	const panelRef = useRef<HTMLDivElement>(null)
	const [sliderValue, setSliderValue] = useState(0)

	// Handle animation and close on ESC key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}

		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown)
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return (
		<div
			ref={panelRef}
			className="bg-white w-full rounded-lg shadow-lg animate-slide-down overflow-hidden mb-3"
		>
			<div className="p-4 border-b flex justify-between items-center">
				<h2 className="text-lg font-medium">Filter</h2>
				<div className="flex items-center gap-3">
					<button className="p-1 text-gray-500 hover:text-gray-700 transition-colors" aria-label="Reset filters">
						<FiRotateCcw size={18} />
					</button>
					<button
						className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
						onClick={onClose}
						aria-label="Close filter panel"
					>
						<FiX size={18} />
					</button>
				</div>
			</div>

			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Category dropdown */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Category</label>
						<div className="relative">
							<select className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
								<option>All</option>
								<option>Invoices</option>
								<option>Bills</option>
								<option>Expenses</option>
							</select>
							<FiChevronDown
								size={16}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
						</div>
					</div>

					{/* Month/Year picker */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Month / Year</label>
						<div className="relative">
							<input
								type="text"
								className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
								placeholder="Select date range"
							/>
							<FiCalendar
								size={16}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
						</div>
					</div>

					{/* Vendors dropdown */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Vendors</label>
						<div className="relative">
							<select className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
								<option>All vendors</option>
								<option>Vendor 1</option>
								<option>Vendor 2</option>
							</select>
							<FiChevronDown
								size={16}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
						</div>
					</div>

					{/* Status dropdown */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Status</label>
						<div className="relative">
							<select className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
								<option>All statuses</option>
								<option>Pending</option>
								<option>Paid</option>
								<option>Overdue</option>
							</select>
							<FiChevronDown
								size={16}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
						</div>
					</div>

					{/* Currency dropdown */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Currency</label>
						<div className="relative">
							<select className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
								<option>All currencies</option>
								<option>USD</option>
								<option>EUR</option>
								<option>GBP</option>
							</select>
							<FiChevronDown
								size={16}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
							/>
						</div>
					</div>

					{/* Search input */}
					<div>
						<label className="block text-sm text-gray-600 mb-1">Search</label>
						<input
							type="text"
							className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
							placeholder="Type anything..."
						/>
					</div>
				</div>

				{/* Slider */}
				<div className="mt-6">
					<div className="flex justify-between items-center mb-1">
						<label className="text-sm text-gray-600">Amount</label>
					</div>
					<div className="relative h-10">
						<input
							type="range"
							min="0"
							max="100"
							value={sliderValue}
							onChange={(e) => setSliderValue(Number.parseInt(e.target.value))}
							className="absolute top-0 left-0 w-full bg-gray-200 rounded-lg appearance-none cursor-pointer"
						/>
						<div
							className="absolute left-0 top-0 h-2 bg-green-500 rounded-lg pointer-events-none"
							style={{ width: `${sliderValue}%` }}
						/>
						<div
							className="absolute top-5 w-6 text-center text-white bg-green-500 rounded-full -mt-1 pointer-events-none"
							style={{ left: `calc(${sliderValue}% - 8px)` }}
						>
							{sliderValue}
						</div>
					</div>
				</div>

				{/* Checkboxes */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="flex items-center">
						<input
							type="checkbox"
							id="unseen"
							className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
						/>
						<label htmlFor="unseen" className="ml-2 text-sm text-gray-700">
							Only un-seen changes
						</label>
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="deleted"
							className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
						/>
						<label htmlFor="deleted" className="ml-2 text-sm text-gray-700">
							Show deleted requests
						</label>
					</div>

					<div className="flex items-center">
						<input
							type="checkbox"
							id="attachments"
							className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
						/>
						<label htmlFor="attachments" className="ml-2 text-sm text-gray-700">
							Only with attachments
						</label>
					</div>
				</div>
			</div>
		</div>
	)
}
