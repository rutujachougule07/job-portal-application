// Notification helper functions for REAL JOB portal

export function notifyEmployerOnApplication(
  employerId: string,
  jobTitle: string,
  applicantName: string
): void {
  // In a real app, this would send a push notification / email / SMS
  // For now we just log it so JobCard.tsx doesn't break
  console.log(`[Notification] New application for "${jobTitle}" from ${applicantName} (employer: ${employerId})`);
}
