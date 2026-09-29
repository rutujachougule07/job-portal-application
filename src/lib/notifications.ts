/**
 * REAL JOB Notification Service
 * Triggers automated Email & WhatsApp notifications to employers when candidates apply for jobs.
 */

export type ApplicationNotificationData = {
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  candidateExp?: string;
  jobTitle: string;
  companyName: string;
  employerEmail?: string;
  employerPhone?: string;
};

/**
 * Format phone number for WhatsApp deep link (e.g., +91 98220 11223 -> 919822011223)
 */
export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return "919822011223"; // Fallback default contact
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Generate formatted WhatsApp message text
 */
export function createWhatsAppMessage(data: ApplicationNotificationData): string {
  const text = `🚨 *नवीन जॉब अर्ज - REAL JOB Portal* 🚨

📋 *पद (Job Title):* ${data.jobTitle}
🏢 *कंपनी (Company):* ${data.companyName}

👤 *उमेदवाराचे नाव (Candidate):* ${data.candidateName}
📞 *मोबाईल (Phone):* ${data.candidateMobile}
📧 *ईमेल (Email):* ${data.candidateEmail}
💼 *अनुभव (Experience):* ${data.candidateExp || "माहिती उपलब्ध नाही"}

⚡ *REAL JOB Portal:* उमेदवाराचा अर्ज तुमच्या कंपनीसाठी पाठवला आहे. अधिक माहितीसाठी उमेदवाराशी संपर्क साधा.`;

  return encodeURIComponent(text);
}

/**
 * Generate WhatsApp URL for direct messaging
 */
export function getWhatsAppUrl(data: ApplicationNotificationData): string {
  const phone = formatWhatsAppPhone(data.employerPhone || "9822011223");
  const msg = createWhatsAppMessage(data);
  return `https://wa.me/${phone}?text=${msg}`;
}

/**
 * Generate Mailto URL for direct email notification
 */
export function getMailtoUrl(data: ApplicationNotificationData): string {
  const email = data.employerEmail || "hr@realjob.com";
  const subject = encodeURIComponent(`[REAL JOB] New Application for ${data.jobTitle} - ${data.candidateName}`);
  const body = encodeURIComponent(
    `Hello ${data.companyName},\n\nYou have received a new candidate application on REAL JOB Portal!\n\nCandidate Details:\n- Name: ${data.candidateName}\n- Phone: ${data.candidateMobile}\n- Email: ${data.candidateEmail}\n- Experience: ${data.candidateExp || "N/A"}\n- Job Title: ${data.jobTitle}\n\nPlease reach out to the candidate directly.\n\nRegards,\nREAL JOB Team`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

/**
 * Trigger Notifications (Automated WhatsApp & Email)
 */
export function notifyEmployerOnApplication(data: ApplicationNotificationData): {
  whatsappUrl: string;
  mailtoUrl: string;
} {
  const whatsappUrl = getWhatsAppUrl(data);
  const mailtoUrl = getMailtoUrl(data);

  // Automatically attempt opening WhatsApp in a new tab if supported
  try {
    if (typeof window !== "undefined") {
      // Store alert record in localStorage for Employer Dashboard
      const existingAlerts = JSON.parse(localStorage.getItem("realjob_employer_notifications") || "[]");
      existingAlerts.unshift({
        id: `notif-${Date.now()}`,
        date: new Date().toISOString(),
        ...data,
      });
      localStorage.setItem("realjob_employer_notifications", JSON.stringify(existingAlerts));
    }
  } catch (e) {
    console.error("Error storing notification alert", e);
  }

  return { whatsappUrl, mailtoUrl };
}
