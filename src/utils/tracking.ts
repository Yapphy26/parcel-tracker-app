import { NextResponse } from "next/server";

// Types
import { TrackingItem, TrackingResponse, TrackingField, DetectRequest } from "@/types/tracking";

export const handleTrackingData = (prev: TrackingResponse | null, page: number, pageSize: number, i: number, updatedData: TrackingResponse) => {
  if (!prev?.data) return prev;
  
  const newData = [...prev.data];
  const updatedIndex = (page - 1) * pageSize + i;
  newData[updatedIndex] = { ...newData[updatedIndex], ...updatedData.data?.[0] };
  return { ...prev, data: newData };
}

export const handlePagedData = (prev: TrackingItem[], i: number, updatedData: TrackingResponse) => {
  if (!Array.isArray(prev)) return prev;

  const newPage = [...prev];
  if (
    typeof i !== "number" ||
    i < 0 ||
    i >= newPage.length ||
    !Array.isArray(updatedData.data) ||
    !updatedData.data[0]
  ) {
    return prev;
  }
  newPage[i] = { ...updatedData.data[0] };
  return newPage;
}

export const apiAuth = () => {
  if (!process.env.TRACKINGMORE_API_KEY) {
    console.error("🚨 Failed to track: Missing Tracking API key.");
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 400 }
    );
  }
};

export const postAPI = async (
  url: string,
  requestBody: DetectRequest[0] | TrackingField[]
): Promise<Response | undefined> => {
  try {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
        "Tracking-Api-Key": process.env.TRACKINGMORE_API_KEY ?? ""
      },
      body: JSON.stringify(requestBody)
    });
  } catch (error) {
    console.error(`🚨 Failed to run ${url}: `, error);
  }
}