"use client";
import Button from "@/components/Button";
import CustomersCarousel from "@/components/CustomersCarousel";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Hero from "@/components/Hero";

interface Plan {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export default function HomePage() {
  const t = useTranslations("home");

  // Type assertion for the plans
  const plans = t.raw("pricing.plans") as Record<string, Plan>;

  return (
    <div className="min-h-screen">
      <Hero
        namespace="home"
        buttons={[
          { text: "hero.cta", variant: "primary", href: "/pricing" },
          { text: "hero.ctaSecondary", variant: "secondary", href: "/contact" },
        ]}
      />

      {/* Customers carousel section*/}
      <CustomersCarousel />

      {/* How it works section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-md font-semibold mb-8">{t("howItWorks.title")}</h2>
        <h2 className="text-4xl font-thin mb-8">{t("howItWorks.subtitle")}</h2>
        <h2 className="text-xl mb-8">{t("howItWorks.description")}</h2>
        <div className="flex gap-4 justify-center">
          {Object.entries(t.raw("howItWorks.steps")).map(([key, step]) => (
            <div className="flex flex-col items-center gap-2" key={key}>
              <div className="w-16 h-16 bg-green-400 rounded-full"></div>
              <h3 className="text-lg font-semibold mt-6">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-md font-semibold mb-8">{t("benefits.title")}</h2>
        <h2 className="text-4xl font-thin mb-8">{t("benefits.subtitle")}</h2>
        <h2 className="text-xl mb-8">{t("benefits.description")}</h2>
      </section>

      {/* Pricing section */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-md font-semibold mb-8">{t("pricing.title")}</h2>
          <h2 className="text-4xl font-thin mb-8">{t("pricing.subtitle")}</h2>
          <p className="text-xl text-gray-600 mb-12">
            {t("pricing.description")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`bg-white rounded-lg shadow-lg p-8 relative ${
                  plan.popular ? "ring-2 ring-green-500" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-green-500 text-white px-3 py-1 text-sm rounded-full">
                    Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                <div className="flex justify-center items-baseline mb-4">
                  <span className="text-5xl font-extrabold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-500 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-md font-semibold mb-4">
              {t("testimonials.title")}
            </h2>
            <h3 className="text-4xl font-thin mb-4">
              {t("testimonials.subtitle")}
            </h3>
            <p className="text-xl text-gray-600">
              {t("testimonials.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.raw("testimonials.items").map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
                <blockquote>
                  <svg
                    className="w-8 h-8 text-gray-300 mb-4"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic">{testimonial.text}</p>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
