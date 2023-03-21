import "@/styles/variables.css";
import "@/styles/globals.css";

import PrimeReact from "primereact/api";

import "primereact/resources/themes/viva-dark/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "@/styles/nav.css";
import "@/styles/charSelect.css";
import "@/styles/xurDetail.css";
import "@/styles/summary.css";
import "@/styles/footer.css";

import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
import { NextPage } from "next";
import Store from "@/components/Store";
import { Analytics } from "@vercel/analytics/react";

PrimeReact.ripple = true;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    const getManifest = async () => {
      console.time("load defs");

      const { setApiKey, verbose, loadDefs, includeTables } = await import("@d2api/manifest-web");

      setApiKey("995db4bb196a42fb8b7426f61f6c8e6e");
      verbose();
      includeTables(["DamageType", "InventoryItem"]);

      await loadDefs();

      console.timeEnd("load defs");
    };

    getManifest();
  }, []);

  return (
    <Store>
      <>
        {getLayout(<Component {...pageProps} />)}
        <Analytics />
      </>
    </Store>
  );
}
