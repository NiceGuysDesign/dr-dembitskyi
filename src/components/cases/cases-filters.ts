/** `"all"` or a case category `documentId` from Strapi */
export type CaseFilterValue = "all" | string;

export interface CaseFilterOption {
  value: CaseFilterValue;
  label: string;
}
