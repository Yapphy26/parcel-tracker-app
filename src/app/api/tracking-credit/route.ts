export async function GET() {
  const resp = await fetch("https://api.trackingmore.com/v2/trackings/getuserinfo", {
    headers: {
      "Trackingmore-Api-Key": process.env.TRACKINGMORE_API_KEY as string
    },
    cache: "no-store" // ensures fresh data every time
  });

  const data = await resp.json();
  
  return Response.json({ balance: data?.data?.plan?.remaining_order ?? null });
}
