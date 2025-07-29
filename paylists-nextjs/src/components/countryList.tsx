"use client"

import { useEffect, useRef, useState } from "react"
import { useCountry } from "@/hooks/use-country"
import { Country } from "@/types/country"
import { getFlagEmoji } from "@/utils/countryemoji"
import { IoMdArrowDropdown } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  setCountry: (country: Country) => void
  setPhoneCode?: (code: number) => void
  defaultCountry?: number
  disabled?: boolean
}

export default function CountryList({ setCountry, setPhoneCode, defaultCountry, disabled }: Props) {
  const { data: countries = [], isLoading } = useCountry()
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Country | null>(null)
  const [showList, setShowList] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowList(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const defaultSelected = countries.find(
      (c: Country) => c.ID === defaultCountry || c.phone_code.id === defaultCountry
    )
    if (defaultSelected) {
      setSelected(defaultSelected)
      setCountry(defaultSelected)
      setPhoneCode?.(defaultSelected.phone_code.id)
    }
  }, [defaultCountry, countries])

  const handleSelect = (country: Country) => {
    setSelected(country)
    setCountry(country)
    setPhoneCode?.(country.phone_code.id)
    setShowList(false)
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Button
        type="button"
        colorSchema="white"
        onClick={() => setShowList((prev) => !prev)}
        className="border-r-0 w-full"
        variant="outline"
        disabled={disabled}
      >
        {selected ? (
          <div className="flex items-center gap-2 justify-center w-full">
            <span className="text-xl">{getFlagEmoji(selected.icon)}</span>
            {setPhoneCode ? (
              <span className="text-sm">{selected.phone_code.phone_code}</span>
            ) : (
              <span className="text-sm">{selected.countryName}</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">Country</span>
        )}
        <IoMdArrowDropdown className="w-4 h-4 ml-2 text-gray-500" />
      </Button>

      {showList && (
        <div className="absolute w-[250px] z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-md max-h-64 overflow-y-auto">
          <Input
            type="text"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search country..."
            className="w-full px-4 py-2 text-sm border-b border-gray-200 focus:outline-none"
          />
          <ul>
            {countries.length > 0 ? (
              countries.filter((c: Country) =>
                c.countryName.toLowerCase().includes(search.toLowerCase())
              ).map((item: Country) => (
                <li
                  key={item.ID}
                  onClick={() => handleSelect(item)}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                >
                  {`${getFlagEmoji(item.icon)} ${item.countryName} (${item.phone_code.phone_code})`}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400">No countries found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}