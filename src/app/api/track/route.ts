import { NextResponse } from "next/server";

// Types
import { TrackingField } from "@/types/tracking";

// Utils
import { apiAuth, postAPI } from "@utils/tracking";

type TrackingFieldWithExisting = TrackingField & {
  existing: boolean;
};

type AllTrackingsResponse = {
  meta: unknown;
  data: TrackingFieldWithExisting[];
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

            const res = await postAPI("https://api.trackingmore.com/v4/couriers/detect", requestBody);
            // if (!res?.ok) {
            //   const errorData = await res?.json();
            //   return { created: false, error: errorData?.meta?.message || "Failed to detect tracking(s)", status: res?.status };
            // }

            const detectionData = await res?.json();

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
      // return { created: false, error: "Failed to detect tracking(s)", status: 500 };
    }
  }

  // Step 2: Check if already exists
  const checkExistingTracking = async (newTrackingData: TrackingField[]) => {
    const tracking_numbers = newTrackingData.map(data => data.tracking_number).join(",");

    try {
      const res = await fetch(`https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${tracking_numbers}`, {
        headers: { "Tracking-Api-Key": process.env.TRACKINGMORE_API_KEY ?? "" }
      });
      // if (!res?.ok) {
      //   const errorData = await res?.json();
      //   if (errorData?.meta?.code === 401) return { created: false, error: "Authentication failed or access denied! This demo is limited by the free plan, so advanced API features are unavailable. Thank you for your understanding.", status: res?.status };
      //   return { created: false, error: errorData?.meta?.message || "Failed to check tracking(s)", status: res?.status };
      // }

      const allTrackings = (await res.json()) as AllTrackingsResponse;

      return newTrackingData.map(data => ({
        ...data,
        existing: allTrackings?.data?.some(
          t => t.tracking_number === data.tracking_number && t.courier_code === data.courier_code
        ) ?? false
      }) as TrackingFieldWithExisting);
    } catch (error) {
      console.error("🚨 Failed to check tracking(s): ", error);
      // return { created: false, error: "Failed to check tracking(s)", status: 500 };
    }
  };

  // Step 3: Create new tracking(s) for non-existing
  const createNewTrackings = async (mixedTrackingData: TrackingFieldWithExisting[]) => {
    const requestBody = mixedTrackingData
      .filter(item => !item.existing) // exclude unwanted
      .map(item => ({
        tracking_number: item.tracking_number,
        courier_code: item.courier_code,
      }) as TrackingField);

    try {
      if (requestBody.length === 0) return { created: false, error: null };
      const res = await postAPI("https://api.trackingmore.com/v4/trackings/batch", requestBody);
      if (!res?.ok) {
        const errorData = await res?.json();
        if (errorData?.meta?.code === 4190) return { created: false, error: "Maximum quota limitation has reached! This quota is limited by the free plan. Thanks for using!", status: res?.status };
        return { created: false, error: errorData?.meta?.message || "Failed to create tracking(s)", status: res?.status };
      }
      return { created: true, error: null };
    } catch (error) {
      console.error("🚨 Failed to create tracking(s): ", error);
      return { created: false, error: "Failed to create tracking(s)", status: 500 };
    }
  };

  // Step 4: Get all tracking(s)
  const getSearchedTracking = async (newTrackingData: TrackingField[]) => {
    try {
      const data = (await Promise.all(
        newTrackingData
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

  if (trackingData.some(t => !t.tracking_number)) {
    return NextResponse.json(
      { error: "Tracking number is empty!" },
      { status: 400 }
    );
  }

  const newTrackingData = (await detectCourierCode(trackingData)) as TrackingField[];

  const mixedTrackingData = (await checkExistingTracking(newTrackingData)) as TrackingFieldWithExisting[];

  const createdTrackingData = await createNewTrackings(mixedTrackingData);
  if (createdTrackingData.error) {
    return NextResponse.json({ error: createdTrackingData.error }, { status: createdTrackingData.status || 500 });
  }

  return await getSearchedTracking(newTrackingData);
}