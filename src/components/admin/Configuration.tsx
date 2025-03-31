import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "../Button";

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function Configuration() {
  const { user } = useAuth();
  const t = useTranslations("admin.configuration");
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [newConfig, setNewConfig] = useState({
    key: "",
    value: "",
    description: "",
  });

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const response = await fetch("/api/configurations");
      if (!response.ok) throw new Error("Failed to fetch configurations");
      const data = await response.json();
      setConfigs(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching configurations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string) => {
    try {
      const response = await fetch("/api/configurations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify({ key, value: editingValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update configuration");
      }

      await fetchConfigurations();
      setEditingKey(null);
      setEditingValue("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error updating configuration"
      );
    }
  };

  const handleAdd = async () => {
    try {
      setError(null);
      const response = await fetch("/api/configurations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add configuration");
      }

      await fetchConfigurations();
      setNewConfig({ key: "", value: "", description: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error adding configuration"
      );
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(t("deleteConfirm"))) return;

    try {
      const response = await fetch(
        `/api/configurations?key=${encodeURIComponent(key)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete configuration");
      }

      await fetchConfigurations();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error deleting configuration"
      );
    }
  };

  const startEditing = (config: SystemConfig) => {
    setEditingKey(config.key);
    setEditingValue(config.value);
  };

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("title")}</h2>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-4">{t("addNew.title")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={t("addNew.key")}
                value={newConfig.key}
                onChange={(e) =>
                  setNewConfig({ ...newConfig, key: e.target.value })
                }
                placeholder={t("addNew.keyPlaceholder")}
              />
              <Input
                label={t("addNew.value")}
                value={newConfig.value}
                onChange={(e) =>
                  setNewConfig({ ...newConfig, value: e.target.value })
                }
                placeholder={t("addNew.valuePlaceholder")}
              />
              <Input
                label={t("addNew.description")}
                value={newConfig.description}
                onChange={(e) =>
                  setNewConfig({ ...newConfig, description: e.target.value })
                }
                placeholder={t("addNew.descriptionPlaceholder")}
              />
            </div>
            <Button className="mt-4" onClick={handleAdd}>
              {t("addNew.addButton")}
            </Button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">{t("existing.title")}</h3>
            <div className="space-y-4">
              {configs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center gap-4 p-4 border rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium">{config.key}</div>
                    <div className="text-sm text-gray-500">
                      {config.description}
                    </div>
                  </div>
                  {editingKey === config.key ? (
                    <div className="flex gap-2">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-48"
                      />
                      <Button
                        onClick={() => handleUpdate(config.key)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {t("existing.save")}
                      </Button>
                      <button
                        onClick={() => {
                          setEditingKey(null);
                          setEditingValue("");
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {t("existing.cancel")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <span className="text-gray-600">{config.value}</span>
                      <button
                        onClick={() => startEditing(config)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {t("existing.edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(config.key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        {t("existing.delete")}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
