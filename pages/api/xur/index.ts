import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // fetch the latest Xur info, the manifest doesn't have this info
  const xurResponse = await axios.get(
    "https://bungie.net/Platform/Destiny2/Vendors/?components=400,402,302,304",
    {
      method: "GET",
      headers: {
        "X-API-Key": process.env.BUNGIE_API_KEY!,
      },
    }
  );

  const { data: xurResJson } = xurResponse;

  const xurSales = xurResJson.Response.sales.data[2190858386].saleItems; // The items Xur is selling

  const xurSalesArr = Object.values(xurSales);

  res.status(200).json({
    success: true,
    data: xurSalesArr,
  });
}
