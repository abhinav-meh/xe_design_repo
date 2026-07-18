"use client";

import { useParams } from "next/navigation";
import { AgreementDetailView } from "@/components/app/agreement-detail-view";

export default function AgreementDetailPage() {
  const params = useParams();
  return (
    <div className="mx-auto max-w-2xl">
      <AgreementDetailView id={String(params.id)} showBack />
    </div>
  );
}
