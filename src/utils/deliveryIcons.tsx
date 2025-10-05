import {
  PackageOpen,
  Truck,
  PackagePlus,
  PackageX,
  PackageCheck,
  PackageSearch,
  CircleX,
  Clock,
  Package2,
} from "lucide-react";

export const deliveryIcons = {
  inforeceived: {
    overviewIcons: <PackageOpen className="w-4 h-4 text-purple-500" />,
    color: "text-purple-500",
    detailIcons: <PackageOpen className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-purple-500 text-white p-1 md:p-1.5" />,
  },
  transit: {
    overviewIcons: <Truck className="w-4 h-4 text-blue-500" />,
    color: "text-blue-500",
    detailIcons: <Truck className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-blue-500 text-white p-1 md:p-1.5" />,
  },
  pickup: {
    overviewIcons: <PackagePlus className="w-4 h-4 text-blue-500" />,
    color: "text-blue-500",
    detailIcons: <PackagePlus className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-blue-500 text-white p-1 md:p-1.5" />,
  },
  undelivered: {
    overviewIcons: <PackageX className="w-4 h-4 text-orange-500" />,
    color: "text-orange-500",
    detailIcons: <PackageX className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-orange-500 text-white p-1 md:p-1.5" />,
  },
  delivered: {
    overviewIcons: <PackageCheck className="w-4 h-4 text-green-600" />,
    color: "text-green-600",
    detailIcons: <PackageCheck className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-green-600 text-white p-1 md:p-1.5" />,
  },
  exception: {
    overviewIcons: <PackageSearch className="w-4 h-4 text-red-600" />,
    color: "text-red-600",
    detailIcons: <PackageSearch className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-red-600 text-white p-1 md:p-1.5" />,
  },
  expired: {
    overviewIcons: <CircleX className="w-4 h-4 text-orange-500" />,
    color: "text-orange-500",
    detailIcons: <CircleX className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-orange-500 text-white p-1 md:p-1.5" />,
  },
  notfound: {
    overviewIcons: <PackageSearch className="w-4 h-4 text-red-600" />,
    color: "text-red-600",
    detailIcons: <PackageSearch className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-red-600 text-white p-1 md:p-1.5" />,
  },
  pending: {
    overviewIcons: <Clock className="w-4 h-4 text-yellow-500" />,
    color: "text-yellow-500",
    detailIcons: <Clock className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 bg-yellow-500 text-white p-1 md:p-1.5" />,
  },
  current: {
    overviewIcons: "",
    color: "",
    detailIcons: "",
    status: [
      { label: "In Transit", value: "transit", icon: <Package2 className="w-4 h-4" /> },
      { label: "Out For Delivery", value: "pickup", icon: <Truck className="w-4 h-4" /> },
      { label: "Delivered", value: "delivered", icon: <PackageCheck className="w-4 h-4" /> },
    ],
    get deliveredIndex() {
      return this.status.findIndex((s) => s.value === "delivered");
    },
  }
};

export type DeliveryStatus = keyof typeof deliveryIcons;

export function isDeliveryStatus(value: string): value is DeliveryStatus {
  return value in deliveryIcons;
}