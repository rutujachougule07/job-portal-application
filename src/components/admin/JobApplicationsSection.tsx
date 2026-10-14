import React, { useState, useEffect, Fragment } from "react";
import { Search, FileText, ExternalLink, Phone, MessageSquare, Check, X, Filter } from "lucide-react";
import { dataStore, ApplicationRecord, openApplicationDocument } from "@/lib/data-store";

interface JobApplicationsSectionProps {
  currentEmployerId?: string;
}

export const JobApplicationsSection: React.FC<JobApplicationsSectionProps> = ({ currentEmployerId }) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [appSearch, setAppSearch] = useState("");
  const [filterJobId, setFilterJobId] = useState<string | null>(null);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const loadApplications = () => {
    let all = dataStore.getApplications();
    if (currentEmployerId) {
      all = all.filter(a => !a.jobId || a.jobId.startsWith(currentEmployerId));
    }
    setApplications(all);
  };

  useEffect(() => {
    loadApplications();
  }, [currentEmployerId]);

  const handleUpdateAppStatus = (appId: string, newStatus: ApplicationRecord["status"]) => {
    dataStore.updateApplicationStatus(appId, newStatus);
    loadApplications();
  };

  const handleSendApplicantReply = (appId: string) => {
    const text = replyTextMap[appId]?.trim();
    if (!text) return;
    dataStore.replyToApplication(appId, text);
    setReplyTextMap(prev => ({ ...prev, [appId]: "" }));
    loadApplications();
    alert("Reply sent to applicant successfully!");
  };

  const filtered = applications
    .filter(a => !filterJobId || a.jobId === filterJobId)
    .filter(a => {
      const q = appSearch.toLowerCase();
      return (
        a.candidateName?.toLowerCase().includes(q) ||
        a.jobTitle?.toLowerCase().includes(q) ||
        a.candidateMobile?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#DCE5F0] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#10233F]">
            Job Applications & Applicants
          </h2>
          <p className="text-xs font-semibold text-[#5B6B7F]">
            Total {applications.length} candidates applied. Contact candidates directly or update application status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {filterJobId && (
            <button
              onClick={() => setFilterJobId(null)}
              className="px-3 py-1.5 rounded-lg border border-[#063B78] text-[#063B78] font-bold text-xs hover:bg-[#063B78]/5 transition-colors"
            >
              ✕ Show All Applications
            </button>
          )}
          <div className="w-full sm:w-64 relative">
            <Search className="absolute left-3 top-3 size-4 text-[#5B6B7F]" />
            <input
              type="text"
              placeholder="Search candidate name, job, or phone..."
              value={appSearch}
              onChange={(e) => setAppSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[#DCE5F0] rounded-xl text-xs font-bold focus:outline-none focus:border-[#063B78]"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#DCE5F0]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#063B78] text-white font-black uppercase">
            <tr>
              <th className="p-3.5">Candidate Name</th>
              <th className="p-3.5">Applied Job</th>
              <th className="p-3.5">Direct Contact</th>
              <th className="p-3.5">Applied Date</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE5F0] font-semibold text-[#10233F]">
            {filtered.map((a) => (
              <Fragment key={a.id}>
                <tr className="hover:bg-[#F5F8FC] transition-colors">
                  <td className="p-3.5 font-black text-[#063B78]">
                    <div>{a.candidateName}</div>
                    <div className="text-[11px] text-[#5B6B7F] font-normal">{a.candidateEmail}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-[#10233F]">{a.jobTitle}</div>
                    <div className="text-[11px] text-[#125BB5]">{a.companyName || "Company"} • {a.location}</div>
                  </td>
                  <td className="p-3.5">
                    <a
                      href={"tel:" + (a.candidateMobile || "").replace(/\D/g, "")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-all inline-flex items-center gap-1 shadow-xs"
                    >
                      📞 Call Candidate
                    </a>
                  </td>
                  <td className="p-3.5 text-[#5B6B7F] font-bold">{a.appliedDate}</td>
                  <td className="p-3.5">
                    <select
                      value={a.status}
                      onChange={(e) => handleUpdateAppStatus(a.id, e.target.value as any)}
                      className="h-8 px-2 rounded-lg border border-[#DCE5F0] text-xs font-black focus:outline-none focus:border-[#063B78] bg-white cursor-pointer"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Viewed">Viewed</option>
                      <option value="Shortlisted">⭐ Shortlisted</option>
                      <option value="Interview">📅 Interview Scheduled</option>
                      <option value="Selected">✅ Selected / Hired</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setExpandedApp(expandedApp === a.id ? null : a.id)}
                      className="px-3 py-1.5 rounded-lg border border-[#DCE5F0] font-bold hover:bg-[#063B78] hover:text-white transition-all text-xs"
                    >
                      {expandedApp === a.id ? "Hide Details" : "View Details"}
                    </button>
                  </td>
                </tr>

                {expandedApp === a.id && (
                  <tr>
                    <td colSpan={6} className="bg-[#FAFBFD] p-5 border-y border-[#DCE5F0]">
                      <div className="space-y-4">
                        <h4 className="font-black text-sm text-[#063B78]">
                          Candidate Profile & Uploaded Documents
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {/* Resume card */}
                          {a.resume && (
                            <div className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                              <div className="font-bold text-[#5B6B7F] capitalize mb-1">Resume / CV</div>
                              <a
                                href="#open-resume"
                                onClick={(e) => {
                                  e.preventDefault();
                                  openApplicationDocument(a, "resume", a.resume);
                                }}
                                className="font-black text-[#125BB5] hover:text-[#063B78] underline inline-flex items-center gap-1.5 cursor-pointer"
                              >
                                <FileText className="size-3.5 shrink-0 text-[#125BB5]" />
                                <span>{a.resume.startsWith("data:") ? "Uploaded_Resume.pdf" : a.resume}</span>
                                <ExternalLink className="size-3 shrink-0 opacity-80" />
                              </a>
                            </div>
                          )}

                          {/* Dynamic fields */}
                          {a.fieldValues && Object.entries(a.fieldValues)
                            .filter(([k]) => !k.startsWith("_file_"))
                            .map(([k, v]) => (
                              <div key={k} className="text-xs bg-[#F5F8FC] p-3 rounded-lg border border-[#DCE5F0]">
                                <div className="font-bold text-[#5B6B7F] capitalize mb-1">{k.replace(/_/g, " ")}</div>
                                <div className="font-black text-[#10233F]">{String(v || "--")}</div>
                              </div>
                            ))}
                        </div>

                        {/* Employer Reply Box */}
                        <div className="mt-4 pt-4 border-t border-[#DCE5F0]">
                          <label className="block text-xs font-black text-[#063B78] mb-1.5">
                            💬 Message / Reply to Candidate:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={replyTextMap[a.id] || ""}
                              onChange={(e) => setReplyTextMap({ ...replyTextMap, [a.id]: e.target.value })}
                              placeholder="e.g. Selected! Please visit for interview tomorrow at 10 AM."
                              className="flex-1 px-3 py-2 border border-[#DCE5F0] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#063B78]"
                            />
                            <button
                              onClick={() => handleSendApplicantReply(a.id)}
                              className="px-4 py-2 bg-[#063B78] text-white rounded-xl text-xs font-black hover:bg-[#084B96] transition-colors"
                            >
                              Send Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#5B6B7F] font-bold">
                  No job applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobApplicationsSection;
