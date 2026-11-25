import { LegalDocumentView, PRIVACY } from "@/widgets/settings/legalDocument";

import { useCloseLegal } from "../model/useCloseLegal";

const PrivacyPage = () => {
  const close = useCloseLegal();
  return <LegalDocumentView document={PRIVACY} onClose={close} />;
};

export default PrivacyPage;
