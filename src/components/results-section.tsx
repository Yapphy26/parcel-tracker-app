"use client";
import { useState, useEffect } from "react";

// Types
import { TrackingResponse } from "@/types/tracking";

// Components
import MobileResult from "@components/results-section/MobileResult";
import DesktopResult from "@/components/results-section/DesktopResult";

// Utils
import { handleTrackingData, handlePagedData } from "@utils/tracking";

// UI
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type TrackingFormResult = {
  trackingData: TrackingResponse | null;
  errorData: string | null;
  setTrackingData: React.Dispatch<React.SetStateAction<TrackingResponse | null>>;
};

export function ResultSection({ trackingData, errorData, setTrackingData }: TrackingFormResult) {
  const [page, setPage] = useState(1);
  const pageSize = 2;
  const [pagedData, setPagedData] = useState(
    Array.isArray(trackingData?.data)
      ? trackingData!.data.slice((page - 1) * pageSize, page * pageSize)
      : []
  );
  const totalPages = Math.ceil((trackingData?.data?.length ?? 0) / pageSize);

  const [loading, setLoading] = useState<string | null>(null);
  const [fields, setFields] = useState(
    pagedData.map((item) => ({
      tracking_number: item.tracking_number,
      courier_code: item.courier_code,
      existing: false,
    }))
  );
  const [errorBackend, setErrorBackend] = useState(null);

  useEffect(() => {
    if (Array.isArray(trackingData?.data)) {
      const newPagedData = trackingData.data.slice((page - 1) * pageSize, page * pageSize);
      setPagedData(newPagedData);

      setFields(
        newPagedData.map((item) => ({
          tracking_number: item.tracking_number,
          courier_code: item.courier_code,
          existing: false,
        }))
      );
    }
  }, [trackingData, page, pageSize]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 pt-6 md:pt-10">
      <h2 className="text-2xl font-semibold text-center">
        {errorData
          ? "Error"
          : trackingData
            ? pagedData.length === 1
              ? "Result"
              : "Results"
            : ""}
      </h2>
      {errorData && (<p className="text-center m-auto">{errorData}</p>)}
      <div className={`flex flex-col ${isMobile && "flex-wrap"} gap-4 pt-4 md:pt-6`}>
        <div className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @2xl/main:grid-cols-1 @5xl/main:grid-cols-1`}>
          {pagedData.map((item, i) => {
            function updateField(i: number, val: string, trackingNumber: string) {
              setFields((prev) => {
                const newFields = [...prev];
                newFields[i] = {
                  ...newFields[i],
                  ["courier_code"]: val,
                  tracking_number: trackingNumber || newFields[i].tracking_number,
                };
                return newFields;
              });
            }

            const handleCourierChange = async (i: number, courierCode: string, trackingNumber: string) => {
              updateField(i, courierCode, trackingNumber);

              try {
                setLoading(`${i}`);
                const res = await fetch("/api/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ courier_code: courierCode, tracking_number: trackingNumber })
                });

                if (!res.ok) {
                  const errorMsg = await res.json();
                  setErrorBackend(errorMsg.error);
                  return;
                }

                const data = await res.json();
                const updatedData = data;

                setTrackingData(prev => handleTrackingData(prev, page, pageSize, i, updatedData));
                setPagedData(prev => handlePagedData(prev, i, updatedData));
                setLoading(null);

                // Poll this tracking until data is populated
                const interval = setInterval(async () => {
                  setLoading(`${i}`);
                  const res = await fetch(`/api/get`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify([{ courier_code: courierCode, tracking_number: trackingNumber }])
                  });

                  const data = await res.json();
                  const updatedData = data;

                  if (updatedData?.trackinfo?.length > 0 || updatedData?.delivery_status !== "pending") {
                    setTrackingData(prev => handleTrackingData(prev, page, pageSize, i, updatedData));
                    setPagedData(prev => handlePagedData(prev, i, updatedData));
                    clearInterval(interval);
                  }
                  setLoading(null);
                }, 2000);

              } catch (err) {
                console.error("API error:", err);
                setLoading(null);
              }
            };
            return (
              <div key={i}>
                {!isMobile ? (
                  <DesktopResult
                    item={item}
                    i={i}
                    loading={loading}
                    fields={fields}
                    errorBackend={errorBackend}
                    handleCourierChange={handleCourierChange}
                  />
                ) : (
                  <MobileResult
                    item={item}
                    i={i}
                    loading={loading}
                    fields={fields}
                    errorBackend={errorBackend}
                    handleCourierChange={handleCourierChange}
                  />
                )}
              </div>
            );
          })}
        </div>
        {trackingData && !errorData && (
          <Pagination className="py-4 pb-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  isActive={page === 1}
                  onClick={() => setPage(1)}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {page > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p !== 1 &&
                    p !== totalPages &&
                    Math.abs(p - page) <= 1 // show current, prev, next
                )
                .map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {page < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    className="cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
