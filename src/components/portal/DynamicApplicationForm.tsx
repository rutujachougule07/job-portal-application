import React from "react";
import { User, Briefcase, Wallet, FileText, CloudUpload, Info } from "lucide-react";
import { groupFieldsBySection } from "@/lib/applicationConfig";

export const DynamicApplicationForm = ({
  appConfig,
  fieldValues,
  setFieldValues,
  customAnswers,
  setCustomAnswers,
  lang,
  category,
}: {
  appConfig: any;
  fieldValues: Record<string, any>;
  setFieldValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  customAnswers: Record<string, any>;
  setCustomAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  lang: string;
  category: string;
}) => {
  const groupedFields = groupFieldsBySection(appConfig.fields);
  const handleFieldChange = (key: string, val: any) => setFieldValues(p => ({ ...p, [key]: val }));
  const handleCustomChange = (id: string, val: any) => setCustomAnswers(p => ({ ...p, [id]: val }));

  const renderField = (fieldKey: string, req: string) => {
    if (req === "hidden") return null;
    const isReq = req === "required";
    const label = fieldKey.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase());
    
    // Check for file inputs
    if (fieldKey === "resume" || fieldKey === "profilePhoto" || fieldKey.toLowerCase().includes("certificate") || fieldKey.toLowerCase().includes("proof") || fieldKey.toLowerCase().includes("portfolio")) {
      return (
        <div key={fieldKey} className="space-y-1.5">
          <label className="block text-sm font-extrabold text-[#10233F]">{label} {isReq && <span className="text-red-500">*</span>} {req === "optional" && <span className="text-gray-400 font-normal text-xs">(Optional)</span>}</label>
          <div className="border-2 border-dashed border-[#DCE5F0] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-[#125BB5] hover:bg-[#F5F8FC] transition-colors relative h-28">
            {fieldKey === "profilePhoto" ? <User className="size-6 text-[#125BB5] mb-1" /> : <CloudUpload className="size-6 text-[#125BB5] mb-1" />}
            <span className="text-[11px] font-semibold text-[#5B6B7F]">Click to upload or drag and drop</span>
            <span className="text-[9px] text-[#8695A7] mt-0.5">{fieldKey === "profilePhoto" ? "JPG, PNG (Max 2MB)" : "PDF, DOC, DOCX (Max 5MB)"}</span>
            <input type="file" required={isReq} onChange={e => handleFieldChange(fieldKey, e.target.files?.[0]?.name)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </div>
        </div>
      );
    }

    return (
      <div key={fieldKey} className="space-y-1.5">
        <label className="block text-sm font-extrabold text-[#10233F]">{label} {isReq && <span className="text-red-500">*</span>}</label>
        {fieldKey === "experience" || fieldKey === "relevantExperience" || fieldKey === "totalExperience" || fieldKey === "totalWorkExperience" || fieldKey === "teachingExperience" || fieldKey === "salesExperience" ? (
          <select required={isReq} value={fieldValues[fieldKey] || ""} onChange={e => handleFieldChange(fieldKey, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]">
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3 Years">1 - 3 Years</option>
            <option value="3-5 Years">3 - 5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        ) : fieldKey === "availability" || fieldKey === "noticePeriod" || fieldKey === "joiningAvailability" ? (
          <input type="date" required={isReq} value={fieldValues[fieldKey] || ""} onChange={e => handleFieldChange(fieldKey, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]" />
        ) : fieldKey === "willingToRelocate" || fieldKey === "fieldSalesExperience" || fieldKey === "travelWillingness" || fieldKey === "onlineTeachingExperience" ? (
            <select required={isReq} value={fieldValues[fieldKey] || ""} onChange={e => handleFieldChange(fieldKey, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]">
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
        ) : fieldKey === "preferredTeachingMode" ? (
            <select required={isReq} value={fieldValues[fieldKey] || ""} onChange={e => handleFieldChange(fieldKey, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]">
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
        ) : fieldKey === "workModePreference" ? (
            <select required={isReq} value={fieldValues[fieldKey] || ""} onChange={e => handleFieldChange(fieldKey, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]">
              <option value="">Select Mode</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Office">Office</option>
            </select>
        ) : (
          <input
            type={fieldKey.toLowerCase().includes("email") ? "email" : fieldKey.toLowerCase().includes("mobile") || fieldKey.toLowerCase().includes("phone") ? "tel" : "text"}
            required={isReq}
            placeholder={`Enter ${label.toLowerCase()}`}
            value={fieldValues[fieldKey] || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
          />
        )}
      </div>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, fieldsObj: Record<string, string>, number: number) => {
    if (Object.keys(fieldsObj).length === 0) return null;
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-lg">
          <div className="text-[#125BB5]">{icon}</div>
          <h3 className="text-[#125BB5] font-extrabold text-sm">{number}. {title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {Object.keys(fieldsObj).map(k => renderField(k, fieldsObj[k]))}
        </div>
      </div>
    );
  };

  let sectionCounter = 1;

  const showInfo = category?.toLowerCase().includes("construct") || category?.toLowerCase().includes("mason") || category?.toLowerCase().includes("manufactur") || category?.toLowerCase().includes("helper");

  return (
    <div className="space-y-2 mt-4">
      {renderSection("Personal Details", <User className="size-5" />, groupedFields.personal, sectionCounter++)}
      {renderSection("Work Details", <Briefcase className="size-5" />, groupedFields.work, sectionCounter++)}
      {renderSection("Salary", <Wallet className="size-5" />, groupedFields.salary, sectionCounter++)}
      
      {appConfig.customQuestions && appConfig.customQuestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-lg">
            <div className="text-[#125BB5]"><Info className="size-5" /></div>
            <h3 className="text-[#125BB5] font-extrabold text-sm">{sectionCounter++}. Job Specific Questions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {appConfig.customQuestions.map((q: any) => (
              <div key={q.id} className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="block text-sm font-extrabold text-[#10233F]">{q.question} {q.required && <span className="text-red-500">*</span>}</label>
                {q.type === "long" ? (
                  <textarea required={q.required} value={customAnswers[q.id] || ""} onChange={e => handleCustomChange(q.id, e.target.value)} className="w-full rounded-xl border border-[#DCE5F0] bg-white p-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]" rows={3} />
                ) : q.type === "yesno" ? (
                  <select required={q.required} value={customAnswers[q.id] || ""} onChange={e => handleCustomChange(q.id, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]">
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : q.type === "number" ? (
                  <input type="number" required={q.required} value={customAnswers[q.id] || ""} onChange={e => handleCustomChange(q.id, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]" />
                ) : q.type === "date" ? (
                  <input type="date" required={q.required} value={customAnswers[q.id] || ""} onChange={e => handleCustomChange(q.id, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]" />
                ) : (
                  <input type="text" required={q.required} value={customAnswers[q.id] || ""} onChange={e => handleCustomChange(q.id, e.target.value)} className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {renderSection("Documents", <FileText className="size-5" />, groupedFields.documents, sectionCounter++)}
      
      {showInfo && (
        <div className="bg-[#F5F8FC] rounded-xl p-4 flex gap-3 border border-[#DCE5F0] mt-6">
          <Info className="size-5 text-[#125BB5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-[#063B78] text-sm">Important</h4>
            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
              Resume is not compulsory for Construction Labour, Helper, Mason and similar worker-level jobs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
