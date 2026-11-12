/** DELETE /api/certifications/{id} 응답이에요. 회수한 개인 공양미와 한 솥 석이에요. */
export interface CertificationDeleteResponse {
  riceRecalled: number;
  potRecalled: number;
}
