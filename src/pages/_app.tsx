import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useState, useMemo } from 'react';
import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';

import { Network } from '@provablehq/aleo-types';
import { AleoWalletProvider } from '@provablehq/aleo-wallet-adaptor-react';
import { WalletModalProvider } from '@provablehq/aleo-wallet-adaptor-react-ui';
import { LeoWalletAdapter } from '@provablehq/aleo-wallet-adaptor-leo';
import { ShieldWalletAdapter } from '@provablehq/aleo-wallet-adaptor-shield';
import { DecryptPermission } from '@provablehq/aleo-wallet-adaptor-core';

// Import global styles and wallet modal styles
import 'swiper/swiper-bundle.css';
import '@/assets/css/globals.css';
import '@provablehq/aleo-wallet-adaptor-react-ui/dist/styles.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page: any) => page);

  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: 'Aleo Starter Template',
      }),
      new ShieldWalletAdapter({ 
        appName: 'Aleo Starter Template',
      }),
    ],
    []
  );

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AleoWalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={Network.TESTNET}
            autoConnect
          >
            <WalletModalProvider>
              <ThemeProvider attribute="data-theme" enableSystem={true} defaultTheme="dark">
                {getLayout(<Component {...pageProps} />)}
              </ThemeProvider>
            </WalletModalProvider>
          </AleoWalletProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;