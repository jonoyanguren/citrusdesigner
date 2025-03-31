import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const AvailablePlaces = () => {
  const t = useTranslations("availablePlaces");
  const [isLoading, setIsLoading] = useState(true);
  const [availablePlaces, setAvailablePlaces] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setAvailablePlaces(data.maxProjects);
        setSubscriptions(data.activeSubscriptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <p className="text-sm text-center font-bold border bg-green-100 border-green-500 text-green-900 rounded-3xl py-2 px-8  w-fit mx-auto">
        {t("loading")}
      </p>
    );
  }

  if (availablePlaces - subscriptions <= 0) {
    return (
      <p className="text-sm text-center font-bold border bg-red-100 border-red-500 text-red-900 rounded-3xl py-2 px-8  w-fit mx-auto">
        {t("noPlaces")}
      </p>
    );
  }

  return (
    <p className="text-sm text-center font-bold border bg-green-100 border-green-500 text-green-900 rounded-3xl py-2 px-8  w-fit mx-auto">
      {availablePlaces - subscriptions} {t("title")}
    </p>
  );
};
