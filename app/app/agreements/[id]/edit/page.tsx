"use client";

import { useParams } from "next/navigation";
import { AgreementWizard } from "@/components/app/agreement-wizard";

export default function EditAgreementPage() {
  const params = useParams();
  return <AgreementWizard editId={String(params.id)} />;
}
