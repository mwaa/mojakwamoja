import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Moja Kwa Moja',
  description: 'Direct donation transfer to beneficiary'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
