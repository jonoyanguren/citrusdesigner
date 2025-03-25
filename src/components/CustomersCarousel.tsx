"use client";
import Image from "next/image";

const logos = Array.from({ length: 8 }, (_, index) => index + 1);

export default function CustomersCarousel() {
  return (
    <div className="relative min-h-24 md:min-h-[12rem] flex flex-col justify-center bg-slate-900 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center">
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
              {logos.map((logo, index) => (
                <li key={index}>
                  <Image
                    src={`/logos/logo${index + 1}.png`}
                    alt={`Logo ${index + 1}`}
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
                    src={`/logos/logo${index + 1}.png`}
                    alt={`Logo ${index + 1}`}
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
