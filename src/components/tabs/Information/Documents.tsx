"use client";
import { memo, useState } from "react";
import ContentHeader from './ContentHeader';

interface LegalDocument {
  title: string;
  year: string;
  filename: string;
}

const legalDocuments: LegalDocument[] = [
  { title: "Certificate of Formation", year: "2024", filename: "certificate-of-formation.pdf" },
  { title: "Governance Framework", year: "2024", filename: "governance-framework.pdf" },
  { title: "Operating Agreement", year: "2024", filename: "operating-agreement.pdf" },
  { title: "Compliance Certification", year: "2024", filename: "compliance-certification.pdf" },
  { title: "Privacy Policy", year: "2025", filename: "privacy-policy.pdf" },
  { title: "Terms of Service", year: "2025", filename: "terms-of-service.pdf" },
  { title: "Acceptable Use Policy", year: "2025", filename: "acceptable-use-policy.pdf" },
  { title: "Cookie Policy", year: "2025", filename: "cookie-policy.pdf" },
  { title: "Data Processing Agreement", year: "2025", filename: "data-processing-agreement.pdf" },
  { title: "Intellectual Property Notice", year: "2024", filename: "ip-notice.pdf" },
  { title: "Risk Disclosure Statement", year: "2025", filename: "risk-disclosure.pdf" },
  { title: "Anti-Money Laundering Policy", year: "2024", filename: "aml-policy.pdf" },
  { title: "Code of Conduct", year: "2024", filename: "code-of-conduct.pdf" },
  { title: "Whistleblower Policy", year: "2025", filename: "whistleblower-policy.pdf" },
  { title: "Conflict of Interest Policy", year: "2024", filename: "conflict-of-interest.pdf" },
  { title: "Information Security Policy", year: "2025", filename: "infosec-policy.pdf" },
  { title: "Third-Party Vendor Policy", year: "2025", filename: "vendor-policy.pdf" },
  { title: "Regulatory Compliance Report", year: "2025", filename: "regulatory-compliance.pdf" },
];

const ITEMS_PER_PAGE = 8;

interface DocumentsProps {
  isTransitioning?: boolean;
}

const Documents = memo(({ isTransitioning = false }: DocumentsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(legalDocuments.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = legalDocuments.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-10 md:py-16 lg:py-20">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <ContentHeader icon="bi-folder" title="Documents" />
        <p
          className="text-base md:text-lg max-w-2xl"
          style={{ color: "var(--content-muted)", lineHeight: 1.6 }}
        >
          Official legal documents, policies, and regulatory filings.
        </p>
      </div>

      {/* 4x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {pageItems.map((doc, i) => (
          <div
            key={`${doc.filename}-${i}`}
            className="group relative flex flex-col justify-between rounded-xl transition-all duration-200"
            style={{
              background: "var(--gradient-card)",
              border: "1px solid var(--border-color)",
              padding: "1.25rem 1.5rem",
              minHeight: "140px",
            }}
          >
            {/* Top: Title & Year */}
            <div>
              <span
                className="block text-xs font-medium tracking-wide uppercase mb-2"
                style={{ color: "var(--content-faint)" }}
              >
                {doc.year}
              </span>
              <h3
                className="text-base md:text-lg font-semibold leading-snug"
                style={{ color: "var(--content-primary)" }}
              >
                {doc.title}
              </h3>
            </div>

            {/* Bottom-right: Download */}
            <div className="flex justify-end mt-4">
              <a
                href={`/documents/${doc.filename}`}
                download
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--content-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--content-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--content-muted)")}
              >
                Download
                <i className="bi bi-download text-sm" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity disabled:opacity-30"
            style={{
              color: "var(--content-muted)",
              border: "1px solid var(--border-color)",
            }}
          >
            <i className="bi bi-chevron-left" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
              style={{
                background: page === currentPage ? "var(--content-primary)" : "transparent",
                color: page === currentPage ? "var(--surface-primary)" : "var(--content-muted)",
                border: page === currentPage ? "none" : "1px solid var(--border-color)",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity disabled:opacity-30"
            style={{
              color: "var(--content-muted)",
              border: "1px solid var(--border-color)",
            }}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}

      {/* Page indicator */}
      <p
        className="text-center mt-4 text-sm"
        style={{ color: "var(--content-faint)" }}
      >
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
});

Documents.displayName = "Documents";

export default Documents;
