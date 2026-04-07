import { useWindowScroll } from '@/hooks/use-window-scroll';
import { useIsMounted } from '@/hooks/use-is-mounted';
import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@provablehq/aleo-wallet-adaptor-react-ui';
import { HomeIcon } from '@/components/icons/home';
import { Twitter } from '@/components/icons/twitter';
import { Discord } from '@/components/icons/discord';
import { useTheme } from 'next-themes';
import Footer from '@/components/ui/Footer';

require('@provablehq/aleo-wallet-adaptor-react-ui/dist/styles.css');

// Define the list of DaisyUI themes you want to offer
const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "synthwave",
];

// ThemeSelector component using Next Themes
function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  // Use a mount flag to avoid SSR mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="select select-bordered max-w-xs"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  );
}

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-3 sm:gap-6 lg:gap-8 btn-primary-content text-primary">
      {/* Use the updated ThemeSelector */}
      <ThemeSelector />
      <WalletMultiButton />
    </div>
  );
}

export function Header() {
  const windowScroll = useWindowScroll();
  const isMounted = useIsMounted();

  return (
    <nav
      className={`fixed top-0 z-30 w-full bg-base-200 transition-all duration-300 ${
        isMounted && windowScroll.y > 10 ? 'shadow-card backdrop-blur' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between px-8 py-8 sm:px-6 lg:px-8 xl:px-10 3xl:px-12">
        <div className="flex items-center space-x-2">
          {process.env.URL && (
            <a
              className="bg-base-300 bg-opacity-20 rounded-full p-2"
              href={`${process.env.URL}`}
            >
              <HomeIcon />
            </a>
          )}
          {process.env.TWITTER && (
            <a
              className="bg-base-300 bg-opacity-20 rounded-full p-2"
              href={`${process.env.TWITTER}`}
            >
              <Twitter width="18" height="18" />
            </a>
          )}
          {process.env.DISCORD && (
            <a
              className="bg-base-300 bg-opacity-20 rounded-full p-2"
              href={`${process.env.DISCORD}`}
            >
              <Discord width="18" height="18" />
            </a>
          )}
        </div>
        {/* Added a wrapper div with margin-left to create more space */}
        <div className="ml-2 mt-2">
          <HeaderRightArea />
        </div>
      </div>
      
    </nav>
  );
  
  
  
}

interface LayoutProps {}

export default function Layout({
  children,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    // Use DaisyUI tokens for the background and text color
    <div className="bg-base-100 text-base-content flex min-h-screen flex-col">
      <Header />
      <main className="mb-12 flex flex-grow flex-col pt-4 sm:pt-12 bg-primary">
        {children}
      </main>
      <Footer />
    </div>
  );
}
