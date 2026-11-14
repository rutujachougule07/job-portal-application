export type DmsUserRole =
  | "SUPER_ADMIN"
  | "HO_ARCHITECT"
  | "SITE_ENGINEER"
  | "SITE_MANAGER"
  | "PROJECT_MANAGER";

export type DrawingCategory =
  | "Architectural"
  | "Structural"
  | "Electrical"
  | "Plumbing"
  | "Civil"
  | "HVAC"
  | "Fire Fighting"
  | "Interior"
  | "Landscaping"
  | "General Arrangement";

export type DrawingStatus =
  | "Draft"
  | "Under Review"
  | "Approved GFC" // Good For Construction
  | "Superseded";

export type RfiPriority = "Low" | "Medium" | "High" | "Critical";

export type RfiStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Answered"
  | "Closed";

export interface ConstructionProject {
  id: string;
  name: string;
  code: string;
  location: string;
  clientName?: string;
  status: "Active" | "Completed" | "On Hold";
  createdAt: string;
  description?: string;
}

export interface DmsDrawingFile {
  id: string;
  drawingId: string;
  revisionId: string;
  fileType: "dwg" | "pdf";
  fileName: string;
  fileUrl: string;
  fileSize: number; // bytes
  storageProvider: "firebase" | "local";
  urn?: string; // Autodesk Model Derivative URN if translated
  translationStatus?: "pending" | "in_progress" | "success" | "failed" | "unconfigured";
  uploadedAt: string;
}

export interface DmsDrawingRevision {
  id: string;
  drawingId: string;
  revisionNumber: string; // e.g. "Rev-00", "Rev-01", "Rev-02"
  revisionDate: string;
  description: string;
  status: DrawingStatus;
  isCurrentApproved: boolean;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
    role: DmsUserRole;
  };
  approvedBy?: {
    id: string;
    name: string;
    email: string;
    date: string;
  };
  publishedAt?: string;
  dwgFile?: DmsDrawingFile;
  pdfFile?: DmsDrawingFile;
  changesSummary?: string;
  createdAt: string;
}

export interface DmsDrawingLayer {
  id: string;
  drawingId: string;
  layerName: string;
  color?: string;
  isVisible: boolean;
  category?: string;
}

export interface DmsMarkupItem {
  id: string;
  type: "circle" | "rectangle" | "arrow" | "line" | "cloud" | "text" | "pen";
  color: string;
  strokeWidth: number;
  points?: Array<{ x: number; y: number }>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
}

export interface DmsDrawingMarkup {
  id: string;
  drawingId: string;
  revisionId: string;
  rfiId?: string;
  engineerId: string;
  engineerName: string;
  engineerRole: DmsUserRole;
  items: DmsMarkupItem[];
  notes?: string;
  attachedPhotoId?: string;
  createdAt: string;
}

export interface DmsDrawingPhoto {
  id: string;
  drawingId: string;
  revisionId: string;
  markupId?: string;
  rfiId?: string;
  photoUrl: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  caption?: string;
  capturedBy: string;
  capturedAt: string;
}

export interface DmsRfiResponse {
  id: string;
  rfiId: string;
  responderId: string;
  responderName: string;
  responderRole: DmsUserRole;
  responseText: string;
  attachedDocUrl?: string;
  attachedDocName?: string;
  respondedAt: string;
  statusAfterResponse: RfiStatus;
}

export interface DmsRfiRequest {
  id: string;
  rfiNumber: string; // e.g. RFI-SC-2026-001
  projectId: string;
  projectName: string;
  drawingId: string;
  drawingNumber: string;
  drawingName: string;
  revisionNumber: string;
  subject: string;
  category: "Structural" | "Architectural" | "MEP" | "Execution Clash" | "Material Spec" | "Dimension Discrepancy" | "Other";
  description: string;
  markupId?: string;
  markupData?: DmsMarkupItem[];
  photoUrls: string[];
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  submittedById: string;
  submittedByName: string;
  submittedByRole: DmsUserRole;
  submittedAt: string;
  priority: RfiPriority;
  status: RfiStatus;
  assignedToId?: string;
  assignedToName?: string;
  responses: DmsRfiResponse[];
  closedAt?: string;
  closedById?: string;
  closedByName?: string;
}

export interface DmsDrawing {
  id: string;
  projectId: string;
  projectName: string;
  drawingNumber: string; // e.g. "SC-STR-DWG-001"
  name: string;
  category: DrawingCategory;
  description?: string;
  currentRevisionNumber: string;
  currentRevisionId: string;
  currentStatus: DrawingStatus;
  isGfcApproved: boolean;
  totalRevisions: number;
  latestDwgUrl?: string;
  latestPdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    role: DmsUserRole;
  };
}

export interface DmsDrawingAccessLog {
  id: string;
  drawingId: string;
  drawingNumber: string;
  revisionNumber: string;
  userId: string;
  userName: string;
  userRole: DmsUserRole;
  action: "VIEW" | "DOWNLOAD" | "MARKUP" | "PRINT" | "APPROVE" | "UPLOAD";
  details?: string;
  timestamp: string;
}

export interface DmsDrawingNotification {
  id: string;
  title: string;
  message: string;
  type: "GFC_PUBLISHED" | "REVISION_SUPERSEDED" | "RFI_SUBMITTED" | "RFI_ANSWERED" | "RFI_CLOSED";
  projectId: string;
  drawingId?: string;
  rfiId?: string;
  targetRole?: DmsUserRole | "ALL";
  isRead: boolean;
  createdAt: string;
}

