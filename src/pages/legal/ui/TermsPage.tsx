import { LegalDocumentView, TERMS } from "@/widgets/settings/legalDocument";

import { useCloseLegal } from "../model/useCloseLegal";

const TermsPage = () => {
  const close = useCloseLegal();
  return <LegalDocumentView document={TERMS} onClose={close} />;
};

export default TermsPage;
