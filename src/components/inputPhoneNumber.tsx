"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneSchema } from "@/lib/validations/components";
import CountryList from "@/components/countryList";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  setPhoneNumber: (value: string) => void;
  setPhoneCode?: (value: number) => void;
  defaultPhoneCode?: string;
  defaultPhoneNumber?: string;
};

export default function InputPhoneNumber({ setPhoneNumber, setPhoneCode, defaultPhoneCode, defaultPhoneNumber }: Props) {
  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: defaultPhoneNumber || "",
    },
  });

  useEffect(() => {
    setValue("phone", defaultPhoneNumber || "")
    setValue("phoneCode", Number(defaultPhoneCode) || NaN)
  }, [defaultPhoneNumber, defaultPhoneCode, setValue])

  return (
    <div className="flex gap-2 w-full mb-4">
      <div className="w-24">
        <CountryList
          setCountry={(value) => {
            setValue("phoneCode", value.phone_code.id)
            setValue("phone", "")
          }}
          setPhoneCode={(value) => setPhoneCode?.(value)}
          defaultCountry={getValues("phoneCode")}
        />
        {errors.phoneCode && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneCode.message}</p>
        )}
      </div>
      <div className="flex-1">
        <Input
          value={watch("phone")}
          onChange={(e) => {
            setValue("phone", e.target.value.replace(/\D/g, ''))
            setPhoneNumber(e.target.value.replace(/\D/g, ''))
          }}
          className={`w-full px-3 py-2 border ${errors.phone || errors.phoneCode ? "border-red-500" : "border-gray-300"
            } rounded-md`}
          placeholder="Phone number"
          error={errors.phone?.message || errors.phoneCode?.message}
        />
      </div>
    </div>
  );
}