import React from "react";
import {
  User,
  Briefcase,
  Wallet,
  FileText,
  CloudUpload,
  Info,
  CheckCircle2,
  HeartPulse,
  GraduationCap,
  Award,
  Phone,
  ShieldCheck,
  HardHat,
  Wrench,
  Sprout,
} from "lucide-react";
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
  const handleFieldChange = (key: string, val: any) =>
    setFieldValues((p) => ({ ...p, [key]: val }));
  const handleCustomChange = (id: string, val: any) =>
    setCustomAnswers((p) => ({ ...p, [id]: val }));

  const catStr = (category || "").toLowerCase();

  const isConstructionCategory =
    catStr.includes("construct") ||
    catStr.includes("mason") ||
    catStr.includes("builder") ||
    catStr.includes("site") ||
    catStr.includes("labor") ||
    catStr.includes("labour") ||
    catStr.includes("worker") ||
    catStr.includes("helper") ||
    catStr.includes("plumber") ||
    catStr.includes("electrician") ||
    catStr.includes("carpenter") ||
    catStr.includes("painter") ||
    catStr.includes("बांधकाम");

  const isFarmingCategory =
    catStr.includes("farm") ||
    catStr.includes("agricultur") ||
    catStr.includes("crop") ||
    catStr.includes("harvest") ||
    catStr.includes("tractor") ||
    catStr.includes("dairy") ||
    catStr.includes("poultry") ||
    catStr.includes("शेती") ||
    catStr.includes("कृषी");

  const isHospitalCategory =
    catStr.includes("hospital") ||
    catStr.includes("health") ||
    catStr.includes("medic") ||
    catStr.includes("nurs") ||
    catStr.includes("doctor") ||
    catStr.includes("clinic") ||
    catStr.includes("pharm") ||
    catStr.includes("lab") ||
    catStr.includes("pathology");

  // DEDICATED CONSTRUCTION WORKER JOB APPLICATION FORM (MATCHING USER IMAGE SECTIONS 1-6)
  if (isConstructionCategory) {
    const handleTypeOfWorkToggle = (item: string) => {
      const currentList = Array.isArray(fieldValues["typeOfWork"])
        ? fieldValues["typeOfWork"]
        : fieldValues["typeOfWork"]
        ? [fieldValues["typeOfWork"]]
        : [];
      const updated = currentList.includes(item)
        ? currentList.filter((i: string) => i !== item)
        : [...currentList, item];
      handleFieldChange("typeOfWork", updated);
    };

    const handleSkillsToggle = (item: string) => {
      const currentList = Array.isArray(fieldValues["skills"])
        ? fieldValues["skills"]
        : fieldValues["skills"]
        ? [fieldValues["skills"]]
        : [];
      const updated = currentList.includes(item)
        ? currentList.filter((i: string) => i !== item)
        : [...currentList, item];
      handleFieldChange("skills", updated);
    };

    const typeOfWorkSelected = Array.isArray(fieldValues["typeOfWork"])
      ? fieldValues["typeOfWork"]
      : fieldValues["typeOfWork"]
      ? [fieldValues["typeOfWork"]]
      : [];

    const skillsSelected = Array.isArray(fieldValues["skills"])
      ? fieldValues["skills"]
      : fieldValues["skills"]
      ? [fieldValues["skills"]]
      : [];

    return (
      <div className="space-y-6 mt-2 text-[#10233F]">
        {/* Banner Header */}
        <div className="bg-[#063B78] text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FFC400]">
              <HardHat className="size-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                Construction Worker Job Application Form
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Official Site &amp; Construction Worker Recruitment Protocol
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase text-white">
            Construction
          </span>
        </div>

        {/* 1. Personal Information */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <User className="size-5" />
            <h4 className="font-black text-sm">1. Personal Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter Full Name"
                value={fieldValues["fullName"] || ""}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={fieldValues["dob"] || ""}
                onChange={(e) => handleFieldChange("dob", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Gender *
              </label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleFieldChange("gender", g)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["gender"] === g
                        ? "bg-[#063B78] text-white border-[#063B78]"
                        : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Marital Status
              </label>
              <select
                value={fieldValues["maritalStatus"] || ""}
                onChange={(e) => handleFieldChange("maritalStatus", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98220 00000"
                value={fieldValues["mobileNumber"] || fieldValues["mobile"] || ""}
                onChange={(e) => handleFieldChange("mobileNumber", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Full address details"
                value={fieldValues["address"] || ""}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                className="w-full rounded-xl border border-[#DCE5F0] p-3 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                City / Village *
              </label>
              <input
                type="text"
                required
                placeholder="City or Village"
                value={fieldValues["cityVillage"] || fieldValues["city"] || ""}
                onChange={(e) => handleFieldChange("cityVillage", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                placeholder="PIN Code"
                value={fieldValues["pinCode"] || ""}
                onChange={(e) => handleFieldChange("pinCode", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com (Optional)"
                value={fieldValues["emailAddress"] || fieldValues["email"] || ""}
                onChange={(e) => handleFieldChange("emailAddress", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>

        {/* 2. Job Information */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Briefcase className="size-5" />
            <h4 className="font-black text-sm">2. Job Information</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Position Applied For *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mason / Helper / Site Work"
                value={fieldValues["positionAppliedFor"] || ""}
                onChange={(e) => handleFieldChange("positionAppliedFor", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-2">
                Type of Work *
              </label>
              <div className="flex flex-wrap gap-2">
                {["Mason", "Helper", "Electrician", "Plumber", "Carpenter", "Painter", "Other"].map((item) => {
                  const isChecked = typeOfWorkSelected.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => handleTypeOfWorkToggle(item)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                        isChecked
                          ? "bg-[#063B78] text-white border-[#063B78]"
                          : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="size-3.5 accent-white pointer-events-none"
                      />
                      {item}
                    </button>
                  );
                })}
              </div>
              {typeOfWorkSelected.includes("Other") && (
                <input
                  type="text"
                  placeholder="Specify other work type..."
                  value={fieldValues["otherWorkType"] || ""}
                  onChange={(e) => handleFieldChange("otherWorkType", e.target.value)}
                  className="mt-2.5 w-full h-10 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-2">
                Employment Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Full Time", "Part Time", "Contract", "Daily Wage"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleFieldChange("employmentType", t)}
                    className={`h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["employmentType"] === t
                        ? "bg-[#063B78] text-white border-[#063B78]"
                        : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  Expected Daily/Monthly Salary (₹) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹800 / day or ₹25,000 / month"
                  value={fieldValues["expectedSalary"] || ""}
                  onChange={(e) => handleFieldChange("expectedSalary", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  Available Joining Date *
                </label>
                <input
                  type="date"
                  required
                  value={fieldValues["availableJoiningDate"] || ""}
                  onChange={(e) => handleFieldChange("availableJoiningDate", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Educational Qualification */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <GraduationCap className="size-5" />
            <h4 className="font-black text-sm">3. Educational Qualification</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-100 text-[#10233F] border border-gray-200">
                  <th className="p-2.5 font-black border border-gray-200">Qualification</th>
                  <th className="p-2.5 font-black border border-gray-200">School / College Name</th>
                  <th className="p-2.5 font-black border border-gray-200 w-32">Passing Year</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((rowIdx) => (
                  <tr key={rowIdx} className="border border-gray-200">
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder={rowIdx === 1 ? "e.g. 10th / 12th / ITI" : "Qualification"}
                        value={fieldValues[`edu_qual_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`edu_qual_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="School or College Name"
                        value={fieldValues[`edu_school_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`edu_school_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="e.g. 2020"
                        value={fieldValues[`edu_year_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`edu_year_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Work Experience (If Any) */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Award className="size-5" />
            <h4 className="font-black text-sm">4. Work Experience (If Any)</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[550px]">
              <thead>
                <tr className="bg-gray-100 text-[#10233F] border border-gray-200">
                  <th className="p-2.5 font-black border border-gray-200">Previous Company / Site</th>
                  <th className="p-2.5 font-black border border-gray-200">Work Type</th>
                  <th className="p-2.5 font-black border border-gray-200 w-28">From (Year)</th>
                  <th className="p-2.5 font-black border border-gray-200 w-28">To (Year)</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((rowIdx) => (
                  <tr key={rowIdx} className="border border-gray-200">
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="Company or Site Name"
                        value={fieldValues[`exp_company_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`exp_company_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="e.g. Masonry / Helping"
                        value={fieldValues[`exp_work_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`exp_work_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="2021"
                        value={fieldValues[`exp_from_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`exp_from_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="2023"
                        value={fieldValues[`exp_to_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`exp_to_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Skills (Select if applicable) */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Wrench className="size-5" />
            <h4 className="font-black text-sm">5. Skills (Select if applicable)</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Masonry", "Electrical Work", "Plumbing", "Carpentry", "Painting", "Machine Handling", "Other"].map((skill) => {
              const isChecked = skillsSelected.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillsToggle(skill)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                    isChecked
                      ? "bg-[#063B78] text-white border-[#063B78]"
                      : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="size-3.5 accent-white pointer-events-none"
                  />
                  {skill}
                </button>
              );
            })}
          </div>
          {skillsSelected.includes("Other") && (
            <input
              type="text"
              placeholder="Specify other skills..."
              value={fieldValues["otherSkills"] || ""}
              onChange={(e) => handleFieldChange("otherSkills", e.target.value)}
              className="mt-3 w-full h-10 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
            />
          )}

          {/* Optional Documents Upload helper */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="block text-xs font-extrabold text-[#10233F] mb-2">
              Documents Upload (Optional - ID Proof / Photo / Resume)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "idProof", label: "ID Proof (Aadhaar / Voter ID / PAN)", accept: ".pdf,.jpg,.png" },
                { key: "photo", label: "Passport Size Photo", accept: ".jpg,.png" },
                { key: "resume", label: "Resume / CV (Optional)", accept: ".pdf,.doc,.docx" },
                { key: "expCert", label: "Experience Certificate (If any)", accept: ".pdf,.jpg,.png" },
              ].map((doc) => {
                const fileName = fieldValues[doc.key];
                return (
                  <div key={doc.key} className="space-y-1">
                    <span className="block text-[11px] font-bold text-[#5B6B7F]">
                      {doc.label}
                    </span>
                    <div
                      className={`border border-dashed ${
                        fileName
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-[#DCE5F0] hover:border-[#063B78] hover:bg-[#F5F8FC]"
                      } rounded-lg p-2.5 flex items-center justify-between text-center transition-colors relative h-12`}
                    >
                      {fileName ? (
                        <span className="text-xs font-black text-emerald-700 truncate">
                          ✓ {fileName}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#5B6B7F] flex items-center gap-1">
                          <CloudUpload className="size-3.5 text-[#063B78]" /> Upload file
                        </span>
                      )}
                      <input
                        type="file"
                        accept={doc.accept}
                        onChange={(e) => handleFieldChange(doc.key, e.target.files?.[0]?.name)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 6. Declaration */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <CheckCircle2 className="size-5" />
            <h4 className="font-black text-sm">6. Declaration</h4>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="constructionDeclaration"
              required
              checked={!!fieldValues["declarationConfirmed"]}
              onChange={(e) => handleFieldChange("declarationConfirmed", e.target.checked)}
              className="mt-1 size-4 accent-[#063B78] cursor-pointer"
            />
            <label
              htmlFor="constructionDeclaration"
              className="text-xs font-bold text-[#10233F] cursor-pointer select-none leading-relaxed"
            >
              I hereby declare that the information given above is true and correct to the best of my knowledge.
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Date
              </label>
              <input
                type="text"
                readOnly
                value={new Date().toLocaleDateString()}
                className="w-full h-10 rounded-xl bg-gray-100 border border-[#DCE5F0] px-3.5 text-xs font-bold text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Signature (Applicant Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="Type your full name as signature"
                value={fieldValues["digitalSignature"] || ""}
                onChange={(e) => handleFieldChange("digitalSignature", e.target.value)}
                className="w-full h-10 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEDICATED FARMING JOB APPLICATION FORM (MATCHING USER IMAGE SECTIONS 1-6)
  if (isFarmingCategory) {
    const handleSkillsToggle = (item: string) => {
      const currentList = Array.isArray(fieldValues["skills"])
        ? fieldValues["skills"]
        : fieldValues["skills"]
        ? [fieldValues["skills"]]
        : [];
      const updated = currentList.includes(item)
        ? currentList.filter((i: string) => i !== item)
        : [...currentList, item];
      handleFieldChange("skills", updated);
    };

    const skillsSelected = Array.isArray(fieldValues["skills"])
      ? fieldValues["skills"]
      : fieldValues["skills"]
      ? [fieldValues["skills"]]
      : [];

    return (
      <div className="space-y-6 mt-2 text-[#10233F]">
        {/* Banner Header */}
        <div className="bg-[#1E5631] text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-[#A3E635]">
              <Sprout className="size-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                Farming Job Application Form
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Official Agriculture &amp; Farm Worker Recruitment Protocol
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase text-white">
            Farming Category
          </span>
        </div>

        {/* 1. Personal Information */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#E8F5E9] rounded-xl text-[#1E5631]">
            <User className="size-5" />
            <h4 className="font-black text-sm">1. Personal Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter Full Name"
                value={fieldValues["fullName"] || ""}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={fieldValues["dob"] || ""}
                onChange={(e) => handleFieldChange("dob", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Gender *
              </label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleFieldChange("gender", g)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["gender"] === g
                        ? "bg-[#1E5631] text-white border-[#1E5631]"
                        : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Full address details"
                value={fieldValues["address"] || ""}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                className="w-full rounded-xl border border-[#DCE5F0] p-3 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                City / Village *
              </label>
              <input
                type="text"
                required
                placeholder="City or Village"
                value={fieldValues["cityVillage"] || fieldValues["city"] || ""}
                onChange={(e) => handleFieldChange("cityVillage", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                placeholder="PIN Code"
                value={fieldValues["pinCode"] || ""}
                onChange={(e) => handleFieldChange("pinCode", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98220 00000"
                value={fieldValues["mobileNumber"] || fieldValues["mobile"] || ""}
                onChange={(e) => handleFieldChange("mobileNumber", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com (Optional)"
                value={fieldValues["emailAddress"] || fieldValues["email"] || ""}
                onChange={(e) => handleFieldChange("emailAddress", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>
          </div>
        </div>

        {/* 2. Job Information */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#E8F5E9] rounded-xl text-[#1E5631]">
            <Briefcase className="size-5" />
            <h4 className="font-black text-sm">2. Job Information</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Position Applied For *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Farm Worker / Tractor Driver / Cultivator"
                value={fieldValues["positionAppliedFor"] || ""}
                onChange={(e) => handleFieldChange("positionAppliedFor", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Type of Farming Work *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Crop Cultivation, Harvesting, Dairy Farm, Spraying"
                value={fieldValues["typeOfFarmingWork"] || ""}
                onChange={(e) => handleFieldChange("typeOfFarmingWork", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-2">
                Employment Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Full Time", "Part Time", "Seasonal", "Contract"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleFieldChange("employmentType", t)}
                    className={`h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["employmentType"] === t
                        ? "bg-[#1E5631] text-white border-[#1E5631]"
                        : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  Expected Salary (₹) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹500 / day or ₹15,000 / month"
                  value={fieldValues["expectedSalary"] || ""}
                  onChange={(e) => handleFieldChange("expectedSalary", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  Available Joining Date *
                </label>
                <input
                  type="date"
                  required
                  value={fieldValues["availableJoiningDate"] || ""}
                  onChange={(e) => handleFieldChange("availableJoiningDate", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Education Details */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#E8F5E9] rounded-xl text-[#1E5631]">
            <GraduationCap className="size-5" />
            <h4 className="font-black text-sm">3. Education Details</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-100 text-[#10233F] border border-gray-200">
                  <th className="p-2.5 font-black border border-gray-200">Qualification</th>
                  <th className="p-2.5 font-black border border-gray-200">School / College Name</th>
                  <th className="p-2.5 font-black border border-gray-200 w-32">Passing Year</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((rowIdx) => (
                  <tr key={rowIdx} className="border border-gray-200">
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder={rowIdx === 1 ? "e.g. 10th / Primary" : "Qualification"}
                        value={fieldValues[`edu_qual_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`edu_qual_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="School or College Name"
                        value={fieldValues[`edu_school_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`edu_school_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                    <td className="p-1.5 border border-gray-200">
                      <input
                        type="text"
                        placeholder="e.g. 2018"
                        value={fieldValues[`edu_year_${rowIdx}`] || ""}
                        onChange={(e) => handleFieldChange(`edu_year_${rowIdx}`, e.target.value)}
                        className="w-full h-9 rounded-lg border border-gray-200 px-2.5 font-semibold text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Work Experience (If Any) */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#E8F5E9] rounded-xl text-[#1E5631]">
            <Award className="size-5" />
            <h4 className="font-black text-sm">4. Work Experience (If Any)</h4>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Farming Experience *
              </label>
              <div className="flex gap-3">
                {["Fresher", "Experienced"].map((exp) => (
                  <button
                    type="button"
                    key={exp}
                    onClick={() => handleFieldChange("farmingExperience", exp)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["farmingExperience"] === exp
                        ? "bg-[#1E5631] text-white border-[#1E5631]"
                        : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {fieldValues["farmingExperience"] === "Experienced" && (
              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  If Experienced, Years *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Years / 5 Years"
                  value={fieldValues["experiencedYears"] || ""}
                  onChange={(e) => handleFieldChange("experiencedYears", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
                />
              </div>
            )}
          </div>
        </div>

        {/* 5. Skills (Select if applicable) */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#E8F5E9] rounded-xl text-[#1E5631]">
            <Sprout className="size-5" />
            <h4 className="font-black text-sm">5. Skills (Select if applicable)</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Crop Cultivation",
              "Tractor Driving",
              "Irrigation",
              "Use of Machinery",
              "Other",
            ].map((skill) => {
              const isChecked = skillsSelected.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillsToggle(skill)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                    isChecked
                      ? "bg-[#1E5631] text-white border-[#1E5631]"
                      : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="size-3.5 accent-white pointer-events-none"
                  />
                  {skill}
                </button>
              );
            })}
          </div>
          {skillsSelected.includes("Other") && (
            <input
              type="text"
              placeholder="Specify other farming skills..."
              value={fieldValues["otherSkills"] || ""}
              onChange={(e) => handleFieldChange("otherSkills", e.target.value)}
              className="mt-3 w-full h-10 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
            />
          )}
        </div>

        {/* 6. Declaration */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2 p-2 bg-[#E8F5E9] rounded-xl text-[#1E5631]">
            <CheckCircle2 className="size-5" />
            <h4 className="font-black text-sm">6. Declaration</h4>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="farmingDeclaration"
              required
              checked={!!fieldValues["declarationConfirmed"]}
              onChange={(e) => handleFieldChange("declarationConfirmed", e.target.checked)}
              className="mt-1 size-4 accent-[#1E5631] cursor-pointer"
            />
            <label
              htmlFor="farmingDeclaration"
              className="text-xs font-bold text-[#10233F] cursor-pointer select-none leading-relaxed"
            >
              I hereby declare that the information given above is true and correct to the best of my knowledge.
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Date
              </label>
              <input
                type="text"
                readOnly
                value={new Date().toLocaleDateString()}
                className="w-full h-10 rounded-xl bg-gray-100 border border-[#DCE5F0] px-3.5 text-xs font-bold text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Signature (Applicant Full Name) *
              </label>
              <input
                type="text"
                required
                placeholder="Type your full name as signature"
                value={fieldValues["digitalSignature"] || ""}
                onChange={(e) => handleFieldChange("digitalSignature", e.target.value)}
                className="w-full h-10 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#1E5631]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEDICATED HOSPITAL JOB APPLICATION FORM (9 SECTIONS)
  if (isHospitalCategory) {
    return (
      <div className="space-y-6 mt-2">
        {/* Banner Header */}
        <div className="bg-[#063B78] text-white p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FFC400]">
              <HeartPulse className="size-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                Hospital Job Application Form
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Official Healthcare &amp; Medical Recruitment Protocol
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase text-white">
            Hospital Category
          </span>
        </div>

        {/* 1. Personal Information */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <User className="size-5" />
            <h4 className="font-black text-sm">1. Personal Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="First Name"
                value={fieldValues["firstName"] || ""}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="Last Name"
                value={fieldValues["lastName"] || ""}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={fieldValues["dob"] || ""}
                onChange={(e) => handleFieldChange("dob", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Gender *
              </label>
              <div className="flex gap-2">
                {["Male", "Female", "Other"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => handleFieldChange("gender", g)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["gender"] === g
                        ? "bg-[#063B78] text-white border-[#063B78]"
                        : "bg-white text-gray-700 border-[#DCE5F0] hover:bg-gray-50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Marital Status
              </label>
              <select
                value={fieldValues["maritalStatus"] || ""}
                onChange={(e) => handleFieldChange("maritalStatus", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Nationality
              </label>
              <input
                type="text"
                placeholder="e.g. Indian"
                value={fieldValues["nationality"] || "Indian"}
                onChange={(e) => handleFieldChange("nationality", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Blood Group
              </label>
              <select
                value={fieldValues["bloodGroup"] || ""}
                onChange={(e) => handleFieldChange("bloodGroup", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Phone className="size-5" />
            <h4 className="font-black text-sm">2. Contact Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98220 00000"
                value={fieldValues["mobileNumber"] || fieldValues["mobile"] || ""}
                onChange={(e) => handleFieldChange("mobileNumber", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@hospital.com"
                value={fieldValues["emailAddress"] || fieldValues["email"] || ""}
                onChange={(e) => handleFieldChange("emailAddress", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Current Address *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Street address, locality, area..."
                value={fieldValues["currentAddress"] || ""}
                onChange={(e) => handleFieldChange("currentAddress", e.target.value)}
                className="w-full rounded-xl border border-[#DCE5F0] p-3 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pune / Mumbai"
                value={fieldValues["city"] || ""}
                onChange={(e) => handleFieldChange("city", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                placeholder="411001"
                value={fieldValues["pinCode"] || ""}
                onChange={(e) => handleFieldChange("pinCode", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>

        {/* 3. Job Details */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Briefcase className="size-5" />
            <h4 className="font-black text-sm">3. Job Details</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Applying For Position *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Staff Nurse / Resident Doctor / Lab Technician"
                value={fieldValues["applyingForPosition"] || ""}
                onChange={(e) => handleFieldChange("applyingForPosition", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Department
              </label>
              <select
                value={fieldValues["department"] || ""}
                onChange={(e) => handleFieldChange("department", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              >
                <option value="">Select Department</option>
                <option value="Nursing">Nursing</option>
                <option value="ICU / CCU">ICU / CCU</option>
                <option value="OPD / Emergency">OPD / Emergency</option>
                <option value="Pathology / Lab">Pathology / Lab</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery / OT">Surgery / OT</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Physiotherapy">Physiotherapy</option>
                <option value="Hospital Admin">Hospital Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Employment Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Full Time", "Part Time", "Contract", "Internship"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => handleFieldChange("employmentType", t)}
                    className={`h-10 rounded-xl border text-[11px] font-extrabold transition-colors ${
                      fieldValues["employmentType"] === t
                        ? "bg-[#063B78] text-white border-[#063B78]"
                        : "bg-white text-gray-700 border-[#DCE5F0]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Preferred Shift *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Day Shift", "Night Shift", "Rotational Shift", "Flexible"].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleFieldChange("preferredShift", s)}
                    className={`h-10 rounded-xl border text-[11px] font-extrabold transition-colors ${
                      fieldValues["preferredShift"] === s
                        ? "bg-[#063B78] text-white border-[#063B78]"
                        : "bg-white text-gray-700 border-[#DCE5F0]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Educational Qualification */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <GraduationCap className="size-5" />
            <h4 className="font-black text-sm">4. Educational Qualification</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Qualification *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MBBS / GNM / B.Sc Nursing / DMLT"
                value={fieldValues["qualification"] || ""}
                onChange={(e) => handleFieldChange("qualification", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                College / University Name
              </label>
              <input
                type="text"
                placeholder="College / University Name"
                value={fieldValues["collegeName"] || ""}
                onChange={(e) => handleFieldChange("collegeName", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Passing Year *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2022"
                value={fieldValues["passingYear"] || ""}
                onChange={(e) => handleFieldChange("passingYear", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Percentage / Grade
              </label>
              <input
                type="text"
                placeholder="e.g. 78% / First Class"
                value={fieldValues["percentageGrade"] || ""}
                onChange={(e) => handleFieldChange("percentageGrade", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>

        {/* 5. Professional Experience */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Award className="size-5" />
            <h4 className="font-black text-sm">5. Professional Experience</h4>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  Are you a Fresher or Experienced? *
                </label>
                <div className="flex gap-2">
                  {["Fresher", "Experienced"].map((exp) => (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => handleFieldChange("fresherOrExperienced", exp)}
                      className={`flex-1 h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                        fieldValues["fresherOrExperienced"] === exp
                          ? "bg-[#063B78] text-white border-[#063B78]"
                          : "bg-white text-gray-700 border-[#DCE5F0]"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                  Total Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 Years 6 Months"
                  value={fieldValues["totalExperience"] || ""}
                  onChange={(e) => handleFieldChange("totalExperience", e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                />
              </div>
            </div>

            {fieldValues["fresherOrExperienced"] === "Experienced" && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#10233F] mb-1">
                    Previous Hospital / Org
                  </label>
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    value={fieldValues["previousHospital"] || ""}
                    onChange={(e) => handleFieldChange("previousHospital", e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#DCE5F0] px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#10233F] mb-1">
                    Job Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Staff Nurse"
                    value={fieldValues["previousJobPosition"] || ""}
                    onChange={(e) => handleFieldChange("previousJobPosition", e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#DCE5F0] px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#10233F] mb-1">
                    From (Year)
                  </label>
                  <input
                    type="text"
                    placeholder="2020"
                    value={fieldValues["experienceFromYear"] || ""}
                    onChange={(e) => handleFieldChange("experienceFromYear", e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#DCE5F0] px-3 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#10233F] mb-1">
                    To (Year)
                  </label>
                  <input
                    type="text"
                    placeholder="2023"
                    value={fieldValues["experienceToYear"] || ""}
                    onChange={(e) => handleFieldChange("experienceToYear", e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#DCE5F0] px-3 text-xs font-bold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Clinical / Medical Skills *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Patient Care, ICU Monitoring, IV Administration, Phlebotomy, OT Assistance"
                value={fieldValues["clinicalMedicalSkills"] || ""}
                onChange={(e) => handleFieldChange("clinicalMedicalSkills", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>

        {/* 6. Medical Registration (If Applicable) */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <ShieldCheck className="size-5" />
            <h4 className="font-black text-sm">6. Medical Registration (If Applicable)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Medical Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g. MMC-12345 / MNC-67890"
                value={fieldValues["medicalRegistrationNumber"] || ""}
                onChange={(e) => handleFieldChange("medicalRegistrationNumber", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Registration Council
              </label>
              <input
                type="text"
                placeholder="e.g. Maharashtra Medical Council / Nursing Council"
                value={fieldValues["registrationCouncil"] || ""}
                onChange={(e) => handleFieldChange("registrationCouncil", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>

        {/* 7. Documents Upload */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <FileText className="size-5" />
            <h4 className="font-black text-sm">7. Documents Upload</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "resume", label: "Resume / CV *", req: true, accept: ".pdf,.doc,.docx" },
              { key: "educationalCertificates", label: "Educational Certificates", req: false, accept: ".pdf,.jpg,.png" },
              { key: "passportSizePhoto", label: "Passport Size Photo", req: false, accept: ".jpg,.png" },
              { key: "medicalRegistrationCertificate", label: "Medical Registration Certificate", req: false, accept: ".pdf,.jpg,.png" },
            ].map((doc) => {
              const fileName = fieldValues[doc.key];
              return (
                <div key={doc.key} className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#10233F]">
                    {doc.label}
                  </label>
                  <div
                    className={`border-2 border-dashed ${
                      fileName
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-[#DCE5F0] hover:border-[#063B78] hover:bg-[#F5F8FC]"
                    } rounded-xl p-3 flex flex-col items-center justify-center text-center transition-colors relative h-24`}
                  >
                    {fileName ? (
                      <>
                        <div className="size-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                          <CheckCircle2 className="size-4" />
                        </div>
                        <span className="text-xs font-black text-emerald-700 truncate max-w-[90%]">
                          {fileName}
                        </span>
                      </>
                    ) : (
                      <>
                        <CloudUpload className="size-5 text-[#063B78] mb-1" />
                        <span className="text-[11px] font-semibold text-[#5B6B7F]">
                          Upload {doc.label.split("*")[0]}
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      required={doc.req && !fileName}
                      accept={doc.accept}
                      onChange={(e) => handleFieldChange(doc.key, e.target.files?.[0]?.name)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. Salary & Availability */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <Wallet className="size-5" />
            <h4 className="font-black text-sm">8. Salary &amp; Availability</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Expected Monthly Salary (₹) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ₹25,000 / month"
                value={fieldValues["expectedMonthlySalary"] || ""}
                onChange={(e) => handleFieldChange("expectedMonthlySalary", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Available Joining Date *
              </label>
              <input
                type="date"
                required
                value={fieldValues["availableJoiningDate"] || ""}
                onChange={(e) => handleFieldChange("availableJoiningDate", e.target.value)}
                className="w-full h-11 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Willing to Relocate? *
              </label>
              <div className="flex gap-2">
                {["Yes", "No"].map((w) => (
                  <button
                    type="button"
                    key={w}
                    onClick={() => handleFieldChange("willingToRelocate", w)}
                    className={`flex-1 h-11 rounded-xl border text-xs font-extrabold transition-colors ${
                      fieldValues["willingToRelocate"] === w
                        ? "bg-[#063B78] text-white border-[#063B78]"
                        : "bg-white text-gray-700 border-[#DCE5F0]"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 9. Declaration */}
        <div className="bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-2 p-2 bg-[#EBF1F8] rounded-xl text-[#063B78]">
            <CheckCircle2 className="size-5" />
            <h4 className="font-black text-sm">9. Declaration</h4>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              id="declaration"
              required
              checked={!!fieldValues["declarationConfirmed"]}
              onChange={(e) => handleFieldChange("declarationConfirmed", e.target.checked)}
              className="mt-1 size-4 accent-[#063B78] cursor-pointer"
            />
            <label
              htmlFor="declaration"
              className="text-xs font-bold text-[#10233F] cursor-pointer select-none leading-relaxed"
            >
              I confirm that the information provided above is accurate and complete to the best
              of my knowledge.
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Date
              </label>
              <input
                type="text"
                readOnly
                value={new Date().toLocaleDateString()}
                className="w-full h-10 rounded-xl bg-gray-100 border border-[#DCE5F0] px-3.5 text-xs font-bold text-gray-700"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#10233F] mb-1">
                Applicant Full Name / Digital Signature *
              </label>
              <input
                type="text"
                required
                placeholder="Type your full name as signature"
                value={fieldValues["digitalSignature"] || ""}
                onChange={(e) => handleFieldChange("digitalSignature", e.target.value)}
                className="w-full h-10 rounded-xl border border-[#DCE5F0] px-3.5 text-xs font-bold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD DYNAMIC FORM FOR OTHER CATEGORIES
  const groupedFields = groupFieldsBySection(appConfig.fields);

  const renderField = (fieldKey: string, req: string) => {
    if (req === "hidden") return null;
    const isReq = req === "required";
    const label = fieldKey
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());

    if (
      fieldKey === "resume" ||
      fieldKey === "profilePhoto" ||
      fieldKey.toLowerCase().includes("certificate") ||
      fieldKey.toLowerCase().includes("proof") ||
      fieldKey.toLowerCase().includes("portfolio")
    ) {
      const fileName = fieldValues[fieldKey];
      return (
        <div key={fieldKey} className="space-y-1.5">
          <label className="block text-sm font-extrabold text-[#10233F]">
            {label} {isReq && <span className="text-red-500">*</span>}{" "}
            {req === "optional" && (
              <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            )}
          </label>
          <div
            className={`border-2 border-dashed ${
              fileName
                ? "border-emerald-500 bg-emerald-50"
                : "border-[#DCE5F0] hover:border-[#125BB5] hover:bg-[#F5F8FC]"
            } rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors relative h-28`}
          >
            {fileName ? (
              <>
                <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                  <CheckCircle2 className="size-5" />
                </div>
                <span className="text-xs font-black text-emerald-700 truncate max-w-[90%]">
                  {fileName}
                </span>
                <span className="text-[10px] font-bold text-emerald-600/70 mt-0.5">
                  Click to change file
                </span>
              </>
            ) : (
              <>
                {fieldKey === "profilePhoto" ? (
                  <User className="size-6 text-[#125BB5] mb-1" />
                ) : (
                  <CloudUpload className="size-6 text-[#125BB5] mb-1" />
                )}
                <span className="text-[11px] font-semibold text-[#5B6B7F]">
                  Click to upload or drag and drop
                </span>
                <span className="text-[9px] text-[#8695A7] mt-0.5">
                  {fieldKey === "profilePhoto"
                    ? "JPG, PNG (Max 2MB)"
                    : "PDF, DOC, DOCX (Max 5MB)"}
                </span>
              </>
            )}
            <input
              type="file"
              required={isReq && !fileName}
              onChange={(e) => handleFieldChange(fieldKey, e.target.files?.[0]?.name)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title={fileName || "Upload file"}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={fieldKey} className="space-y-1.5">
        <label className="block text-sm font-extrabold text-[#10233F]">
          {label} {isReq && <span className="text-red-500">*</span>}
        </label>
        {fieldKey === "experience" ||
        fieldKey === "relevantExperience" ||
        fieldKey === "totalExperience" ||
        fieldKey === "totalWorkExperience" ||
        fieldKey === "teachingExperience" ||
        fieldKey === "salesExperience" ? (
          <select
            required={isReq}
            value={fieldValues[fieldKey] || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
          >
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3 Years">1 - 3 Years</option>
            <option value="3-5 Years">3 - 5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        ) : fieldKey === "availability" ||
          fieldKey === "noticePeriod" ||
          fieldKey === "joiningAvailability" ? (
          <input
            type="date"
            required={isReq}
            value={fieldValues[fieldKey] || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
          />
        ) : fieldKey === "willingToRelocate" ||
          fieldKey === "fieldSalesExperience" ||
          fieldKey === "travelWillingness" ||
          fieldKey === "onlineTeachingExperience" ? (
          <select
            required={isReq}
            value={fieldValues[fieldKey] || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        ) : (
          <input
            type={
              fieldKey.toLowerCase().includes("email")
                ? "email"
                : fieldKey.toLowerCase().includes("mobile") ||
                  fieldKey.toLowerCase().includes("phone")
                ? "tel"
                : "text"
            }
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

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    fieldsObj: Record<string, string>,
    number: number
  ) => {
    if (Object.keys(fieldsObj).length === 0) return null;
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-lg">
          <div className="text-[#125BB5]">{icon}</div>
          <h3 className="text-[#125BB5] font-extrabold text-sm">
            {number}. {title}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {Object.keys(fieldsObj).map((k) => renderField(k, fieldsObj[k] || ""))}
        </div>
      </div>
    );
  };

  let sectionCounter = 1;

  const showInfo =
    (category || "").toLowerCase().includes("construct") ||
    (category || "").toLowerCase().includes("mason") ||
    (category || "").toLowerCase().includes("manufactur") ||
    (category || "").toLowerCase().includes("helper");

  return (
    <div className="space-y-2 mt-4">
      {renderSection(
        "Personal Details",
        <User className="size-5" />,
        groupedFields.personal,
        sectionCounter++
      )}
      {renderSection(
        "Work Details",
        <Briefcase className="size-5" />,
        groupedFields.work,
        sectionCounter++
      )}
      {renderSection(
        "Salary",
        <Wallet className="size-5" />,
        groupedFields.salary,
        sectionCounter++
      )}

      {appConfig.customQuestions && appConfig.customQuestions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 p-2 bg-[#EBF1F8] rounded-lg">
            <div className="text-[#125BB5]">
              <Info className="size-5" />
            </div>
            <h3 className="text-[#125BB5] font-extrabold text-sm">
              {sectionCounter++}. Job Specific Questions
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {appConfig.customQuestions.map((q: any) => (
              <div key={q.id} className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="block text-sm font-extrabold text-[#10233F]">
                  {q.question} {q.required && <span className="text-red-500">*</span>}
                </label>
                {q.type === "long" ? (
                  <textarea
                    required={q.required}
                    value={customAnswers[q.id] || ""}
                    onChange={(e) => handleCustomChange(q.id, e.target.value)}
                    className="w-full rounded-xl border border-[#DCE5F0] bg-white p-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                    rows={3}
                  />
                ) : (
                  <input
                    type="text"
                    required={q.required}
                    value={customAnswers[q.id] || ""}
                    onChange={(e) => handleCustomChange(q.id, e.target.value)}
                    className="w-full h-12 rounded-xl border border-[#DCE5F0] bg-white px-4 text-sm font-semibold text-[#10233F] focus:outline-none focus:ring-2 focus:ring-[#063B78]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {renderSection(
        "Documents",
        <FileText className="size-5" />,
        groupedFields.documents,
        sectionCounter++
      )}

      {showInfo && (
        <div className="bg-[#F5F8FC] rounded-xl p-4 flex gap-3 border border-[#DCE5F0] mt-6">
          <Info className="size-5 text-[#125BB5] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-[#063B78] text-sm">Important</h4>
            <p className="text-xs font-semibold text-[#5B6B7F] mt-1">
              Resume is not compulsory for Construction Labour, Helper, Mason and similar
              worker-level jobs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
