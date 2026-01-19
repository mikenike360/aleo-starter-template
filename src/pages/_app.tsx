// _app.tsx
import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
import { useState } from 'react';
import Head from 'next/head';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'next-themes';

// Import Aleo Wallet Adapter dependencies
import { WalletProvider } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletModalProvider } from '@demox-labs/aleo-wallet-adapter-reactui';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from '@demox-labs/aleo-wallet-adapter-base';

// Import global styles and wallet modal styles
import 'swiper/swiper-bundle.css';

import '@/assets/css/globals.css';

import '@demox-labs/aleo-wallet-adapter-reactui/styles.css';

import { CURRENT_NETWORK, CURRENT_RPC_URL } from '@/types';

// Initialize the wallet adapters outside the component
const wallets = [
  new LeoWalletAdapter({
    appName: 'zKontract',
  }),
];

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.TestnetBeta}
            autoConnect
            
          >
            <WalletModalProvider>
              <ThemeProvider attribute="data-theme" enableSystem={true} defaultTheme="dark">
                {getLayout(<Component {...pageProps} />)}
              </ThemeProvider>
            </WalletModalProvider>
          </WalletProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
