import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import prisma from "@/lib/prisma";
import itemTypeMap from "@/helpers/itemTypeMap";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed", success: false });

    return;
  }

  // get data from request body
  const { membershipType, membershipId, access_token, characterId } = req.body;

  const missingMembershipType = membershipType === undefined || membershipType === null; // 0 is a valid membership type

  if (!membershipId || missingMembershipType || !access_token || !characterId) {
    res.status(400).json({
      message: "Membership ID, Membership Type, Access Token, and Character Id are all required",
      success: false,
    });
    return;
  }

  const xurVendorHash = 2190858386;

  const xurConfig = {
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/Character/${characterId}/Vendors/${xurVendorHash}/?components=402,304`,
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY!,
      Authorization: `Bearer ${access_token}`,
    },
  };

  const xurResponse = await axios(xurConfig);

  const xurData = xurResponse.data.Response;

  const xurSalesKeys = Object.keys(xurData.sales.data);

  // combine with stats
  const combinedItems = xurSalesKeys.reduce((acc: any[], curr) => {
    const item = xurData.sales.data[curr];
    const itemStats = xurData.itemComponents.stats.data[curr];

    acc.push({ ...item, stats: itemStats });

    return acc;
  }, []);

  res.status(200).json({
    success: true,
    items: combinedItems,
  });
}
