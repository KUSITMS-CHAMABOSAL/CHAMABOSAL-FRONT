/**
 * 약관 글 속에서 링크로 바꿀 글자와 주소예요. 서비스 오픈 정책 2-2상 허용되는 공공기관 사이트와 문의 메일만 걸어요.
 * 전화번호는 `tel:`이 열리는지 확인되지 않아 걸지 않아요.
 */
export const LEGAL_LINKS: Readonly<Record<string, string>> = {
  "www.kopico.go.kr": "https://www.kopico.go.kr",
  "privacy.kisa.or.kr": "https://privacy.kisa.or.kr",
  "www.spo.go.kr": "https://www.spo.go.kr",
  "ecrm.police.go.kr": "https://ecrm.police.go.kr",
  "deliverytomoney@gmail.com": "mailto:deliverytomoney@gmail.com",
};
