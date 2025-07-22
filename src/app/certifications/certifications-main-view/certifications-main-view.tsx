"use client";

import { CertificationPrimitive } from "@/app/types/certification-primitive";
import { ServerResponse } from "@/server/types/response";
import { CertificationsForm } from "../certifications-form";
import { useState } from "react";
import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { axiosClient } from "@/lib/axios-client";

interface CertificationsMainViewProps {
  certifications: ServerResponse<CertificationPrimitive[]>;
}

export function CertificationsMainView({
  certifications,
}: CertificationsMainViewProps) {
  const [selectedCertification, setSelectedCertification] =
    useState<CertificationPrimitive | null>(null);

  const [createCertification, setCreateCertification] = useState(false);

  function handleSelectCertification(certification: CertificationPrimitive) {
    setSelectedCertification(certification);
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-3 h-full border border-border rounded-lg p-4 bg-card">
        <div className="flex flex-row gap-2 items-center justify-between mb-4">
          <Button
            onClick={() => {
              setCreateCertification(true);
              setSelectedCertification(null);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4" />
            Crear Certificación
          </Button>
        </div>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          {certifications.data.map((certification) => (
            <div key={certification.id}>
              <Button
                className="w-full p-2 rounded-md"
                variant={
                  selectedCertification?.id === certification.id
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  setCreateCertification(false);
                  handleSelectCertification(certification);
                }}
              >
                {certification.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-6">
        {createCertification && (
          <CertificationsForm key="create" axiosClient={axiosClient} />
        )}
        {selectedCertification && (
          <CertificationsForm
            key={selectedCertification.id}
            axiosClient={axiosClient}
            certificationPrimitive={selectedCertification ?? undefined}
          />
        )}
      </div>
    </div>
  );
}
