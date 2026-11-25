/** 약관 본문 한 덩어리예요. 노션 원문의 문단, 번호 목록, 점 목록을 그대로 나눠요. */
export type LegalBlock =
  | { kind: "text"; text: string }
  | { kind: "numbered"; items: readonly string[] }
  | { kind: "bulleted"; items: readonly string[] };

export interface LegalSection {
  /** "제1조 (목적)"처럼 조 제목이에요. */
  title: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDocument {
  title: string;
  effectiveDate: string;
  /** 첫 조 앞에 오는 문단이에요. */
  preamble: readonly LegalBlock[];
  sections: readonly LegalSection[];
}
