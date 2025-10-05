"use client";
import { useState } from "react";

// Libs
import { format } from "date-fns";

// Types
import { TrackingItem } from "@/types/tracking";

// Components
import CourierOptions from "@components/courier-options";

// Icons
import { Clock, Truck } from "lucide-react";
import { deliveryIcons, isDeliveryStatus } from "@utils/deliveryIcons";
import { carrierIcons, isCarrierIcons } from "@utils/carrierIcons";

// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import "@/components/ui/css/accordion.css"

type DesktopResultProps = {
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

export default function DesktopResult({
  item,
  i,
  loading,
  fields,
  errorBackend,
  handleCourierChange,
}: DesktopResultProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const currentStatus = deliveryIcons.current.status;
  const currentIndex = currentStatus.findIndex(s => s.value === item.delivery_status);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const deliveredIndex = currentStatus.findIndex(s => s.value === "delivered");

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`accordion-${i}`}
    >
      <Card className={`relative w-full gap-0 p-0`}>
        <div className={`min-w-[55px] @[320px]:min-w-[65px] max-w-[65px] absolute top-[28px] left-[24px] ${loading == `${i}` && "opacity-0 invisible"}`}>
          <CourierOptions
            isDisabled={item.delivery_status === "invalid"}
            value={fields[i].courier_code}
            onChange={(val) => {
              if (item.delivery_status === "invalid") handleCourierChange(i, val, item.tracking_number);
            }}
          />
        </div>
        <AccordionItem value="item-1">
          {loading == `${i}` && (
            <div className="absolute w-full h-full flex gap-1 items-center justify-center p-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg className="mr-1 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Loading...</span>
            </div>
          )}
          <AccordionTrigger
            onClick={(e) => {
              if (item.delivery_status !== "invalid") return setActiveAccordion("accordion-" + i);
              e.preventDefault();
            }}
            className={`items-start p-6 ps-[calc(24px+65px+20px)] cursor-pointer ${item.delivery_status === "invalid" && "cursor-not-allowed"} ${loading == `${i}` && "opacity-0 invisible"} hover:no-underline`}>
            <div className={`max-w-1/3 w-full flex flex-col gap-1 ${loading == `${i}` && "opacity-0 invisible"}`}>
              <CardDescription>
                <span className="truncate">{isCarrierIcons(item.courier_code) ? carrierIcons[item.courier_code].label : "Auto"}</span>
              </CardDescription>
              <CardTitle className="w-full text-md font-semibold tabular-nums @[767px]/card:text-lg">
                <h3 className="truncate">{item.tracking_number}</h3>
              </CardTitle>
            </div>
            <div className={`max-w-1/3 w-full flex flex-col gap-1 text-sm ${loading == `${i}` && "opacity-0 invisible"}`}>
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
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {item.delivery_status !== "invalid" && activeAccordion === "accordion-" + i && (
              <div onClick={(e) => e.stopPropagation()} className={`relative inset-0 flex items-start justify-center z-50 overflow-y-auto py-6 pb-3 cursor-auto transition-opacity duration-300`} >
                <Card className="@container/card gap-3 max-w-4xl w-full relative mx-4 z-2">
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
                        <div className={`relative min-w-[28px] flex justify-center items-start ${index !== (item.origin_info.trackinfo.length - 1) && "after:content-[''] after:absolute after:w-[2px] after:h-[calc(100%+32px-28px)] sm:after:h-[calc(100%+32px-32px)] md:after:h-[calc(100%+32px-36px)] after:bg-[#CCC] dark:after:bg-[#777] after:top-[24px] sm:after:top-[28px] md:after:top-[32px] after:rounded-xl"}`}>
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
                  </CardContent>
                </Card>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
}