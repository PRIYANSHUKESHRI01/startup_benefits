
'use client';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

NProgress.configure({ showSpinner: false, trickleSpeed: 120, minimum: 0.15 });

export default function RouteChangeLoader() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
    // eslint-disable-next-line
  }, [pathname]);

  return null;
}
