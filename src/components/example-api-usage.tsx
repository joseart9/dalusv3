"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ExampleApiUsage = () => {
  const { apiCall } = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async () => {
    setIsLoading(true);
    try {
      // The middleware will automatically validate the token
      // and the useApi hook will include it in the request
      const response = await apiCall("/api/v1/comments?welder_id=1");

      if (response.ok) {
        const data = await response.json();
        toast.success("API call successful!");
        console.log("Data:", data);
      } else {
        const error = await response.json();
        toast.error(error.error || "API call failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Example API Usage</h3>
      <Button onClick={handleApiCall} disabled={isLoading}>
        {isLoading ? "Calling API..." : "Test Protected API"}
      </Button>
    </div>
  );
};
