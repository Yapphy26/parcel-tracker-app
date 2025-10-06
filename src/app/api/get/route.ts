import { NextResponse } from "next/server";

// Types
import { TrackingField } from "@/types/tracking";

// Utils
import { apiAuth, postAPI } from "@utils/tracking";

type AllTrackingsResponse = {
  meta: unknown;
  data: TrackingField[];
};

export async function POST(req: Request) {
  const trackingData = (await req.json()) as TrackingField[];

  apiAuth();

  // Step 1: Detect courier code 
  const detectCourierCode = async (trackingData: TrackingField[]) => {
    try {
      const autoEnabled = (await Promise.all(
        trackingData
          .flatMap(async (item) => {
            if (item.courier_code !== "auto") return [{ ...item }];

            const requestBody = {
              tracking_number: item.tracking_number
            };

            const detectionRes = await postAPI("https://api.trackingmore.com/v4/couriers/detect", requestBody);
            const detectionData = await detectionRes?.json();

            const mapped = detectionData?.data?.map((detect: { courier_code: string }) => ({
              ...item,
              courier_code: detect?.courier_code ?? "auto"
            })) ?? [];

            return mapped.length > 0
              ? mapped
              : [{ ...item }];
          })
      )).flat();

      return Array.from(
        new Map(autoEnabled.map(item => [
          `${item.tracking_number}_${item.courier_code}`,
          item
        ])).values()
      );
    } catch (error) {
      console.error("🚨 Failed to detect tracking(s): ", error);
      return false;
    }
  }

  // Step 2: Get all tracking(s)
  const getSearchedTracking = async (trackingData: TrackingField[]) => {
    try {
      const data = (await Promise.all(
        trackingData
          .map(async (item) => {
            const res = await fetch(`https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${item.tracking_number}&courier_code=${item.courier_code}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Tracking-Api-Key": process.env.TRACKINGMORE_API_KEY ?? ""
              }
            });
            if (!res.ok && res.status === 400) {
              return [{ ...item, delivery_status: "invalid" }]
            }

            const resData = (await res.json()) as AllTrackingsResponse;

            return (resData?.data && resData.data.length > 0)
              ? resData.data
              : [{ ...item, delivery_status: "invalid" }]
          })
      )).flat();

      const output = {
        meta: { code: 200, message: "Request response is successful" },
        data: data
      };

      return NextResponse.json(output, { status: 200 });
    } catch (error) {
      console.error("🚨 Failed to get tracking(s): ", error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  };

  const newTrackingData = (await detectCourierCode(trackingData)) as TrackingField[];

  return await getSearchedTracking(newTrackingData);
}