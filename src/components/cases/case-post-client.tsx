"use client";

import { Case } from "@/strapi/cases";
import CasePostMeta from "./case-post-meta";
import CaseContent from "./case-content";

interface CasePostClientProps {
  caseItem: Case;
}

export default function CasePostClient({ caseItem }: CasePostClientProps) {

  return (
    <>
      {/* Case Meta */}
      <CasePostMeta caseItem={caseItem} />

      {/* Case Content */}
      <div className="mt-6 md:mt-8 lg:mt-12 max-w-[1440px] mx-auto">
        <CaseContent content={caseItem.content} />
      </div>
    </>
  );
}
