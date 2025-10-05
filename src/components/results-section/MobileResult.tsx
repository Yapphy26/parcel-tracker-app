"use client";
import { useState, useRef, useEffect } from "react";

// Libs
import { format } from "date-fns";

// Types
import { TrackingItem } from "@/types/tracking";

// Components
import CourierOptions from "@components/courier-options";

// Icons
import { Clock, Truck, X } from "lucide-react";
import { deliveryIcons, isDeliveryStatus } from "@utils/deliveryIcons";
import { carrierIcons, isCarrierIcons } from "@utils/carrierIcons";

// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type MobileResultProps = {
  item: TrackingItem;
  i: number;
  loading: string | null;
  fields: {
    tracking_number: string;
    courier_code: string;
    existing: boolean;
  }[];
  errorBackend: string | null;
  handleCourierChange: (i: number, courierCode: string, trackingNumber: string) => Promise<void>;
};

export default function MobileResult({
  item,
  i,
  loading,
  fields,
  errorBackend,
  handleCourierChange,
}: MobileResultProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isShort, setIsShort] = useState(false);
  const modal = useRef<HTMLDivElement | null>(null); // 👈 tell TS it"s a div
  const currentStatus = deliveryIcons.current.status;
  const currentIndex = currentStatus.findIndex(s => s.value === item.delivery_status);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const deliveredIndex = currentStatus.findIndex(s => s.value === "delivered");

  useEffect(() => {
    const checkHeight = () => {
      if (modal.current) {
        setIsShort(modal.current.offsetHeight < window.innerHeight);
      }
    };

    checkHeight(); // run on mount
    window.addEventListener("resize", checkHeight);

    return () => {
      window.removeEventListener("resize", checkHeight);
    };
  }, []);

  return (
    <Card
      onClick={() => {
        if (item.courier_code === "auto") return;
        setTimeout(() => setIsOpen(true), 10);
        setActiveModal("modal-" + i);
      }}
      className={`relative gap-3 cursor-pointer ${item.delivery_status === "invalid" && "cursor-not-allowed"}`}>
      {loading == `${i}` && (
        <div className="absolute w-full h-full flex gap-1 items-center justify-center p-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg className="mr-1 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">Loading...</span>
        </div>
      )}
      <CardHeader className={`w-full flex justify-start flex-col gap-3 ${loading == `${i}` && "opacity-0 invisible"}`}>
        <CardDescription className="w-full flex items-center gap-2">
          <div className={`flex shrink-0 font-medium`}>
            <CourierOptions
              isDisabled={item.delivery_status === "invalid"}
              value={fields[i].courier_code}
              onChange={(val) => {
                if (item.delivery_status === "invalid") handleCourierChange(i, val, item.tracking_number);
              }}
            />
          </div>
          <span className="truncate font-medium">{isCarrierIcons(item.courier_code) ? carrierIcons[item.courier_code].label : "Auto"}</span>
        </CardDescription>
        <CardTitle className="w-full text-md font-semibold tabular-nums @[767px]/card:text-lg">
          <h3 className="truncate">{item.tracking_number}</h3>
        </CardTitle>
      </CardHeader>
      <CardFooter className={`flex-col items-start gap-1 text-sm ${loading == `${i}` && "opacity-0 invisible"}`}>
        <div className="text-muted-foreground">Status</div>
        <div className={`flex gap-1.5 font-medium line-height-[20px] rounded-sm ${item.delivery_status === "invalid" ? "text-orange-500" : isDeliveryStatus(item.delivery_status) ? deliveryIcons[item.delivery_status].color : ""}`}>
          <div className="min-w-[16px] mt-0.5">
            {item.delivery_status === "invalid"
              ? <Clock className={`w-4 h-4 ${errorBackend ? "text-red-600" : "text-orange-500"}`} />
              : isDeliveryStatus(item.delivery_status)
                ? deliveryIcons[item.delivery_status].overviewIcons
                : <Clock className="w-4 h-4 text-gray-400" />}
          </div>
          <span className="capitalize">
            {(() => {
              if (item.delivery_status === "invalid") {
                return (
                  errorBackend
                    ? (
                      <span className="text-red-600">Something went wrong, please try again later</span>
                    ) : (
                      <span>
                        pending <span className="normal-case">(please select a carrier)</span>
                      </span>
                    )
                );
              }
              return item.delivery_status;
            })()}
          </span>
        </div>
      </CardFooter>
      {/* Modal */}
      {item.delivery_status !== "invalid" && activeModal === "modal-" + i && (
        <div onClick={(e) => e.stopPropagation()} className={`fixed inset-0 flex items-start ${isShort && "items-center"} justify-center z-50 overflow-y-auto py-6 cursor-auto transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} >
          {/* Modal content */}
          <Card ref={modal} className="@container/card gap-3 max-w-4xl w-full relative mx-4 z-2">
            <button
              className="absolute top-6 right-6 hover:text-[#666] dark:hover:text-[#AAA] cursor-pointer"
              onClick={() => { setIsOpen(false); setTimeout(() => setActiveModal(null), 300) }}
            >
              <X />
            </button>
            <CardHeader className="gap-1">
              <CardTitle className="text-md font-semibold tabular-nums md:text-lg">
                <CardDescription>
                  <div className="flex gap-1.5 font-medium mb-1">
                    <Truck className="w-5 h-5" />
                    <span>{isCarrierIcons(item.courier_code) ? carrierIcons[item.courier_code].label : ""}</span>
                  </div>
                </CardDescription>
                <h4>{item.tracking_number} <span className="text-sm text-yellow-500 font-normal">{item.origin_info.trackinfo.length === 0 && "(Please make sure the tracking number is existed)"}</span></h4>
                <CardDescription>
                  <div className="mt-1 font-medium">
                    <span>{format(new Date(item.latest_checkpoint_time), "yyyy MMM d")}</span>
                  </div>
                </CardDescription>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 mb-6">
              <div className="max-w-[400px] [calc(100%/3)] flex items-start justify-between mx-auto mb-8">
                {currentStatus.map((step, idx) => (
                  <div key={idx} className="w-full relative flex flex-col items-center">
                    {/* Step circle */}
                    <div className={`flex items-center justify-center w-8 sm:w-12 h-8 sm:h-12 rounded-full text-white transition-all duration-500 delay-500 ease-in-out ${(idx < safeIndex || safeIndex == deliveredIndex) ? "bg-green-600" : idx == safeIndex ? "bg-blue-500" : "bg-gray-500"}`}>
                      {step.icon}
                    </div>
                    {/* Step label */}
                    <div className={`mt-2 text-xs sm:text-sm text-center w-full font-medium transition-all duration-500 delay-500 ease-in-out ${(idx < safeIndex || safeIndex == deliveredIndex) ? "text-green-600" : idx == safeIndex ? "text-blue-500" : "text-gray-500"}`}>
                      {step.label}
                    </div>
                    {/* Connector line */}
                    {idx < currentStatus.length - 1 && (
                      <div className={`absolute w-[50%] h-[2px] sm:h-[3px] top-[15px] sm:top-[23px] left-[75%] rounded-xl bg-gray-500`}>
                        <div className={`absolute w-0 h-full bg-green-600 rounded-xl transition-all duration-500 ease-in-out ${(idx < safeIndex || safeIndex == deliveredIndex) && "w-full"}`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {item.origin_info.trackinfo.map((event, index) => (
                <div key={index} className={`flex gap-4 ${index !== (item.origin_info.trackinfo.length - 1) && "mb-8"}`}>
                  <div className="min-w-[55px] sm:min-w-[60px] md:min-w-[70px] text-xs text-end">
                    <p className="md:text-sm font-medium opacity-40 mb-1">{format(new Date(event.checkpoint_date), "MMM d")}</p>
                    <p className="sm:text-sm md:text-base">{format(new Date(event.checkpoint_date), "h:mm a")}</p>
                  </div>
                  <div className={`relative min-w-[28px] flex justify-center items-start ${index !== (item.origin_info.trackinfo.length - 1) && "after:content-[''] after:absolute after:w-[2px] after:h-[calc(100%+32px-28px)] sm:after:h-[calc(100%+32px-32px)] md:after:h-[calc(100%+32px-36px)] after:bg-[#CCC] dark:after:bg-[#777] after:top-[24px] sm:after:top-[28px] md:after:top-[32px] after:rounded-xl"}`}
                  >
                    <div className="overflow-hidden flex justify-center items-start font-medium rounded-xl">
                      {isDeliveryStatus(event.checkpoint_delivery_status)
                        ? deliveryIcons[event.checkpoint_delivery_status].detailIcons
                        : <Clock className="w-5 h-5 text-white-400" />}
                    </div>
                  </div>
                  <div className="min-w-[calc(100%-55px-28px-(24px*2))] sm:min-w-[calc(100%-60px-28px-(24px*2))] md:min-w-[calc(100%-70px-28px-(24px*2))] text-xs">
                    <p className="md:text-sm font-medium opacity-40 mb-1">{event.location || "-"}</p>
                    <p className="sm:text-sm md:text-base">{event.tracking_detail}</p>
                  </div>
                </div>
              ))}
              {/* <pre className="whitespace-pre-wrap">
                            {JSON.stringify(item, null, 2)}
                          </pre> */}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <button
                onClick={() => { setIsOpen(false); setTimeout(() => setActiveModal(null), 300) }}
                className="w-full px-3 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:opacity-90"
              >
                Close
              </button>
            </CardFooter>
          </Card>
          <div className="fixed inset-0 flex items-center justify-center bg-black opacity-50 z-1" onClick={() => { setIsOpen(false); setTimeout(() => setActiveModal(null), 300) }}></div>
        </div>
      )}
    </Card>
  );
}