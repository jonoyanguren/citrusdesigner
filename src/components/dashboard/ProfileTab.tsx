import { DeliverableType, User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Input from "@/components/Input";
import { makeApiRequest } from "@/lib/api";
import { DeliverableSelect } from "@/components/admin/DeliverableSelect";
import LoadingSpinner from "../ui/LoadingSpinner";

interface Props {
  user: User | null;
}

interface PasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export function ProfileTab({ user }: Props) {
  const t = useTranslations("dashboard.profile");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferDeliverable, setPreferDeliverable] =
    useState<DeliverableType | null>(user?.preferDeliverable || null);
  const [savingPreference, setSavingPreference] = useState(false);
  const [preferenceStatus, setPreferenceStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formData, setFormData] = useState<PasswordFormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<PasswordFormData>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setPreferDeliverable(user?.preferDeliverable || null);
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PasswordFormData> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = t("password.validation.required");
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("password.validation.minLength");
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("password.validation.required");
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = t("password.validation.match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await makeApiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          password: formData.newPassword,
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: t("password.success"),
        });
        setShowPasswordForm(false);
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({});
      } else {
        const data = await response.json();
        setSubmitStatus({
          type: "error",
          message: data.message || t("password.error"),
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: t("password.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof PasswordFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    // Clear submit status when user starts typing
    setSubmitStatus(null);
  };

  const saveDeliverablePreference = async () => {
    try {
      setSavingPreference(true);
      setPreferenceStatus(null);

      const { ok, data } = await makeApiRequest("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify({
          preferDeliverable,
        }),
      });

      if (ok) {
        setPreferDeliverable(data.user.preferDeliverable);
        setPreferenceStatus({
          type: "success",
          message: t("preferenceSuccess"),
        });
      } else {
        setPreferenceStatus({
          type: "error",
          message: data.error || t("preferenceError"),
        });
      }
    } catch {
      setPreferenceStatus({
        type: "error",
        message: t("preferenceError"),
      });
    } finally {
      setSavingPreference(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("name")}
              </label>
              <p className="mt-1 text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("role")}
              </label>
              <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("memberSince")}
              </label>
              <p className="mt-1 text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            {/* Preferred Delivery Method */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("preferDeliverable")}
              </label>
              <div className="flex gap-4 items-start">
                <div className="w-full max-w-xs">
                  <DeliverableSelect
                    onSelect={setPreferDeliverable}
                    selectedDeliverable={preferDeliverable}
                    label=""
                  />
                </div>
                <button
                  onClick={saveDeliverablePreference}
                  disabled={savingPreference}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {savingPreference ? t("saving") : t("savePreference")}
                </button>
              </div>
              {preferenceStatus && (
                <p
                  className={`mt-2 text-sm ${
                    preferenceStatus.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {preferenceStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white shadow rounded-lg p-6 h-fit">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t("password.title")}</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t("password.changeButton")}
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Input
                type="password"
                name="newPassword"
                label={t("password.newPassword")}
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
              />

              <Input
                type="password"
                name="confirmPassword"
                label={t("password.confirmPassword")}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />

              <div className="flex flex-col items-end space-y-3">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setFormData({
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setErrors({});
                      setSubmitStatus(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t("password.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "..." : t("password.submit")}
                  </button>
                </div>
                {submitStatus && (
                  <p
                    className={`text-sm ${
                      submitStatus.type === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
