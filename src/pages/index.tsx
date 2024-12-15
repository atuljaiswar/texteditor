import { Geist, Geist_Mono } from "next/font/google";
const RichTextEditor = dynamic(
  () => import("../component/TextEditor"), // Adjust the path to match your component's location
  { ssr: false }
);

import "@/styles/globals.scss";
import dynamic from 'next/dynamic';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
   <div className='wrapper'>
    <RichTextEditor/>
   </div>
  );
}
