// "use client";

import Link from "next/link";
import Image from "next/image";

// UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Aceternity
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Motion
import * as motion from "motion/react-client"

export const metadata = {
  title: "ParcelOTW | About",
  description: "About ParcelOTW"
};

export const contactInfo = [
  {
    label: "Email",
    value: "Please submit via contact page",
    link: "/contact"
  },
  {
    label: "Phone",
    value: "Please submit via contact page",
    link: "/contact"
  },
  {
    label: "LinkedIn",
    value: "/in/yong-pok-hang",
    link: "https://www.linkedin.com/in/yong-pok-hang/"
  },
  {
    label: "GitHub",
    value: "/Yapphy26",
    link: "https://github.com/Yapphy26"
  }
];

export default function About() {
  return (
    <div className="max-w-[992px] flex flex-wrap gap-[20px] m-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
        className="relative max-w-full md:max-w-[calc(100%-300px-20px)] w-full gap-2 order-2 md:order-1"
      >
        <Card>
          <GlowingEffect
            blur={0}
            borderWidth={1}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <CardHeader>
            <CardTitle>
              <h1 className="text-xl font-semibold">About ParcelOTW</h1>
              <CardDescription>
                <span className="text-xs font-medium">2025 Oct 4</span>
              </CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">ParcelOTW (Parcel On The Way) is a modern, responsive parcel tracking solution built with Next.js, designed to provide a seamless user experience with a clean and intuitive interface. Beyond its minimalistic design, it incorporates enhanced features that improve usability and ensure smooth navigation across devices of all sizes.</p><br />
            <p className="text-sm">
              The system leverages the TrackingMore API, a trusted and scalable tracking service, to deliver accurate, real-time parcel information. Since the API itself is not free, basic features are unavailable, but you can explore and try the full implementation through the open-source code available on my <Link href={`${contactInfo[3].link}/parcel-tracker-app/`} target="_blank" className="text-blue-500">GitHub</Link>. This integration ensures that users can reliably monitor shipments from multiple carriers through a single platform.</p><br />
            <p className="text-sm">
              By combining performance-driven architecture with thoughtful UI/UX principles, ParcelOTW offers businesses and end-users a professional, efficient, and reliable way to stay informed about their deliveries.</p><br />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 0.25 },
        }}
        className="relative max-w-full md:max-w-[300px] w-full order-1 md:order-2"
      >
        <Card className="h-full">
          <GlowingEffect
            blur={0}
            borderWidth={1}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <CardHeader className="relative h-full flex justify-center items-center m-6 p-0">
            <Image src="/images/logos/logo-parcelotw.png" alt="Logo" width={192} height={98} />
          </CardHeader>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 0.5 },
        }}
        className="relative w-full order-3"
      >
        <Card className="px-5 py-6">
          <GlowingEffect
            blur={0}
            borderWidth={1}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <CardHeader className="flex flex-wrap gap-x-[20px] gap-y-4 p-0">
            {contactInfo.map((item, index) => (
              <div key={index}
                style={{
                  "--mobile-width": `100%`,
                  "--tablet-width": `calc((100% - (20px * (2 - 1))) / 2)`,
                  "--desktop-width": `calc((100% - (20px * (4 - 1))) / 4)`
                } as React.CSSProperties}
                className="w-[var(--mobile-width)] md:w-[var(--tablet-width)] lg:w-[var(--desktop-width)]"
              >
                <Link href={item.link} className="w-full">
                  <Card className="relative px-4 py-3 rounded-md bg-none transition ease-in hover:dark:bg-white/10 active:dark:bg-white/5 hover:bg-black/10 active:bg-black/5">
                    <CardTitle>
                      <h4 className="text-sm font-semibold">{item.label}</h4>
                      <CardDescription>
                        <p className="text-xs font-medium">{item.value}</p>
                      </CardDescription>
                    </CardTitle>
                  </Card>
                </Link>
              </div>
            ))}
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
}
