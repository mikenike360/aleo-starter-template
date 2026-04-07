import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import Layout from '@/layouts/_layout';
import Button from '@/components/ui/button';
import { useWallet } from '@provablehq/aleo-wallet-adaptor-react';
import { WalletNotConnectedError } from '@provablehq/aleo-wallet-adaptor-core';
import { useRouter } from 'next/router';

// Uncomment this line to enable the animated background ✨
// const GLSLBackground = dynamic(() => import('../utils/GLSLBackground'), { ssr: false });

const MainPage: NextPageWithLayout = () => {
  const { address } = useWallet();
  const router = useRouter();

  const handleButtonClick = async () => {
    try {
      if (!address) {
        throw new WalletNotConnectedError();
      }
      router.push('/dashboard'); // Change to your target route
    } catch (error) {
      alert('Please connect your wallet to continue.');
    }
  };

  return (
    <>
      <NextSeo
        title="Aleo Starter Template"
        description="Build Aleo apps faster with this open-source starter kit"
      />

      {/* Optional: Background animation */}
      {/* <GLSLBackground /> */}

      <div className="fixed inset-0 bg-primary bg-opacity-80 z-10 flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-5xl font-extrabold text-center tracking-tight text-primary-content sm:text-6xl">
          Aleo Starter
        </h1>
        <p className="mt-4 text-lg text-center text-primary-content max-w-lg">
          Build private-by-default apps with Aleo, React, Tailwind, and Leo Wallet.
        </p>

        <div className="flex flex-col items-center mt-10 space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
          <Button
            onClick={handleButtonClick}
            className="btn btn-primary px-6 py-3 text-lg font-semibold"
          >
            {address ? 'Enter App' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </>
  );
};

MainPage.getLayout = (page) => <Layout>{page}</Layout>;
export default MainPage;