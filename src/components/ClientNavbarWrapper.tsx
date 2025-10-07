'use client';

import dynamic from 'next/dynamic';

// ✅ Explicitly tell dynamic() which export to use
const FloatingNavbar = dynamic(
  () => import('./FloatingNavbar').then((mod) => mod.FloatingNavbar),
  { ssr: false }
);

export default function ClientNavbarWrapper() {
  return <FloatingNavbar />;
}
