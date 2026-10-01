export const getFallbackConfig = (category: string) => {
  const cat = (category || "").toLowerCase();
  
  const config = {
    fields: {
      fullName: "required" as any,
      mobile: "required" as any,
      currentLocation: "required" as any,
    } as Record<string, string>,
    customQuestions: []
  };

  if (cat.includes("construct") || cat.includes("mason")) {
    config.fields = {
      ...config.fields,
      email: "optional",
      preferredWorkLocation: "required",
      jobType: "required",
      totalWorkExperience: "required",
      relevantExperience: "required",
      skills: "required",
      previousWorkExperience: "optional",
      availability: "required",
      willingToRelocate: "optional", // Yes/No -> we will handle this in UI if it sees 'willingToRelocate'
      expectedSalary: "required",
      resume: "optional",
      workExperienceCertificate: "optional",
      skillCertificate: "optional",
      profilePhoto: "optional",
    };
  } else if (cat.includes("it") || cat.includes("software") || cat.includes("tech")) {
    config.fields = {
      ...config.fields,
      email: "required",
      preferredWorkLocation: "required",
      highestQualification: "required",
      degree: "required",
      college: "optional",
      passingYear: "required",
      totalExperience: "required",
      relevantExperience: "required",
      currentCompany: "optional",
      currentJobTitle: "optional",
      technicalSkills: "required",
      programmingLanguages: "required",
      frameworks: "required",
      projects: "required",
      github: "optional",
      portfolio: "optional",
      linkedin: "optional",
      currentCTC: "optional",
      expectedCTC: "required",
      noticePeriod: "required",
      workModePreference: "optional",
      resume: "required",
      certifications: "optional",
    };
  } else if (cat.includes("engineer")) {
    config.fields = {
      ...config.fields,
      email: "required",
      preferredWorkLocation: "required",
      engineeringBranch: "required",
      degree: "required",
      college: "optional",
      passingYear: "required",
      totalExperience: "required",
      relevantExperience: "required",
      technicalSkills: "required",
      softwareTools: "optional",
      projects: "optional",
      previousCompany: "optional",
      previousJobRole: "optional",
      currentCTC: "optional",
      expectedCTC: "required",
      noticePeriod: "required",
      willingToRelocate: "optional",
      resume: "required",
      engineeringCertificate: "optional",
      relevantCertifications: "optional",
    };
  } else if (cat.includes("health") || cat.includes("medic") || cat.includes("nurs")) {
    config.fields = {
      ...config.fields,
      email: "required",
      preferredWorkLocation: "required",
      qualification: "required",
      specialization: "required",
      college: "optional",
      passingYear: "required",
      totalExperience: "required",
      relevantExperience: "required",
      previousHospital: "optional",
      currentRole: "optional",
      medicalSkills: "required",
      department: "optional",
      registrationNumber: "optional", // Required only when applicable
      registrationAuthority: "optional",
      registrationValidity: "optional",
      expectedSalary: "required",
      noticePeriod: "required",
      shiftAvailability: "required",
      willingToRelocate: "optional",
      resume: "required",
      qualificationCertificate: "optional",
      licenseProof: "optional", // Required only when applicable
      relevantCertificates: "optional",
    };
  } else if (cat.includes("finance") || cat.includes("account")) {
    config.fields = {
      ...config.fields,
      email: "required",
      preferredWorkLocation: "required",
      highestQualification: "required",
      degree: "required",
      college: "optional",
      passingYear: "required",
      totalExperience: "required",
      relevantExperience: "required",
      currentCompany: "optional",
      previousJobRole: "optional",
      accountingSkills: "required",
      accountingSoftwareKnowledge: "optional",
      tallyKnowledge: "optional",
      excelKnowledge: "optional",
      sapKnowledge: "optional",
      gstExperience: "optional",
      certifications: "optional",
      currentCTC: "optional",
      expectedCTC: "required",
      noticePeriod: "required",
      resume: "required",
    };
  } else if (cat.includes("sales") || cat.includes("market")) {
    config.fields = {
      ...config.fields,
      email: "required",
      preferredWorkLocation: "required",
      totalExperience: "required",
      salesExperience: "required",
      previousCompany: "optional",
      previousJobRole: "optional",
      salesSkills: "required",
      marketingSkills: "optional",
      industryExperience: "optional",
      salesTargetExperience: "optional",
      targetHandled: "optional",
      teamHandlingExperience: "optional",
      customerHandlingExperience: "required",
      fieldSalesExperience: "optional",
      travelWillingness: "optional",
      expectedSalary: "required",
      expectedIncentive: "optional",
      noticePeriod: "required",
      resume: "optional",
      portfolio: "optional",
    };
  } else if (cat.includes("educat") || cat.includes("teach")) {
    config.fields = {
      ...config.fields,
      email: "required",
      preferredWorkLocation: "required",
      highestQualification: "required",
      degree: "required",
      subject: "required",
      college: "optional",
      passingYear: "required",
      teachingExperience: "required",
      subjectsTaught: "required",
      classesTaught: "optional",
      previousSchool: "optional",
      teachingSkills: "required",
      onlineTeachingExperience: "optional",
      teachingCertifications: "optional",
      expectedSalary: "required",
      noticePeriod: "required",
      preferredTeachingMode: "optional",
      willingToRelocate: "optional",
      resume: "required",
      educationCertificates: "optional",
    };
  } else if (cat.includes("manufactur") || cat.includes("factory") || cat.includes("production")) {
    config.fields = {
      ...config.fields,
      email: "optional",
      preferredWorkLocation: "required",
      jobType: "required",
      totalExperience: "required",
      relevantExperience: "required",
      previousCompany: "optional",
      previousJobRole: "optional",
      productionExperience: "optional",
      machineExperience: "optional",
      technicalSkills: "required",
      qualityControlExperience: "optional",
      productionLineExperience: "optional",
      safetyKnowledge: "optional",
      shiftExperience: "optional",
      shiftAvailability: "required",
      teamHandlingExperience: "optional",
      expectedSalary: "required",
      joiningAvailability: "required",
      willingToRelocate: "optional",
      resume: "optional",
      experienceCertificate: "optional",
      skillCertificate: "optional",
    };
  } else {
    // Default general fields
    config.fields = {
      ...config.fields,
      email: "optional",
      resume: "optional",
      experience: "optional",
    };
  }
  return config;
};

export const groupFieldsBySection = (fields: Record<string, string>) => {
  const sections = {
    personal: {} as Record<string, string>,
    work: {} as Record<string, string>,
    salary: {} as Record<string, string>,
    documents: {} as Record<string, string>,
  };

  Object.keys(fields).forEach(key => {
    const k = key.toLowerCase();
    const val = fields[key];
    if (!val) return;

    if (k.includes("name") || k.includes("email") || k.includes("mobile") || k.includes("location")) {
      sections.personal[key] = val;
    } else if (k.includes("salary") || k.includes("ctc") || k.includes("wage") || k.includes("notice") || k.includes("joining") || k.includes("availability") || k.includes("mode") || k.includes("shift")) {
      sections.salary[key] = val;
    } else if (k.includes("resume") || k.includes("certificate") || k.includes("photo") || k.includes("portfolio") || k.includes("proof")) {
      sections.documents[key] = val;
    } else {
      sections.work[key] = val;
    }
  });

  return sections;
};
