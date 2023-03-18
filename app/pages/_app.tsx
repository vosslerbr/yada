import "@/styles/variables.css";
import "@/styles/globals.css";

import "primereact/resources/themes/viva-dark/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "@/styles/nav.css";
import "@/styles/charSelect.css";
import "@/styles/xurDetail.css";
import "@/styles/summary.css";
import "@/styles/footer.css";

import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Store from "@/components/Store";
import { Analytics } from "@vercel/analytics/react";

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

  return (
    <Store>
      <>
        {getLayout(<Component {...pageProps} />)}
        <Analytics />
      </>
    </Store>
  );
}
