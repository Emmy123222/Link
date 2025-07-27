import { useRouter, useSearchParams } from "next/navigation"
import { Avatar } from "./avatar";
import { Card } from "./card";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";

interface Props {
  customers: any[]
  route?: string
}

export function CardList({ customers, route = "/customers" }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <div className="flex flex-wrap gap-3 overflow-y-auto">
      {customers?.map((customer, index) => (
        <Card key={customer.id} title={customer.business_name} image={<Avatar 
          src={customer?.image || customer?.logo_url || null}
          name={customer.name} 
          width={70} 
          height={70}
          className="w-full h-full" 
          entityType="customer"
        />}
          onClick={() => router.push(`${route}/${customer.id}?type=${searchParams.get("type")}`)}
          badge={customer.ownerId ? "Verified" : "Unverified"}
          badgeIcon={
            customer.ownerId ?
              (<IoCheckmarkCircleSharp className={`w-4 h-4 text-green-500`} />)
              :
              (<IoCloseCircleSharp className={`w-4 h-4 text-yellow-500`} />)
          }
        >
          <p>{customer.name + index}</p>
          <p>{customer.email}</p>
          <p>{customer.phone}</p>
          <p>{customer.street_1 + ", " + customer.city + ", " + customer?.countryCode?.countryName}</p>
          <p>{customer.registration_number}</p>
        </Card>
      ))
      }
    </div >
  )
}