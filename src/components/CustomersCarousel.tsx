"use client";
import Image from "next/image";

const logos = [
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/facebook.svg",
    alt: "Facebook",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/disney.svg",
    alt: "Disney",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/airbnb.svg",
    alt: "Airbnb",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/apple.svg",
    alt: "Apple",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/spark.svg",
    alt: "Spark",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/samsung.svg",
    alt: "Samsung",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/quora.svg",
    alt: "Quora",
  },
  {
    src: "https://cruip-tutorials.vercel.app/logo-carousel/sass.svg",
    alt: "Sass",
  },
];

export default function CustomersCarousel() {
  return (
    <div className="relative min-h-[12rem] flex flex-col justify-center bg-slate-900 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center">
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
              {logos.map((logo, index) => (
                <li key={index}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={75}
                    className="object-contain max-w-none"
                  />
                </li>
              ))}
            </ul>
            <ul
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll"
              aria-hidden="true"
            >
              {logos.map((logo, index) => (
                <li key={`clone-${index}`}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={150}
                    height={75}
                    className="object-contain max-w-none"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
