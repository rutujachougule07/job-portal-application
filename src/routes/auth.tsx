import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowLeft,
  Building2,
  Camera,
  Check,
  Eye,
  EyeOff,
  HardHat,
  Languages,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Phone,
  RotateCcw,
  Upload,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { LogoIcon } from "@/components/portal/Brand";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useI18n, languages, type LanguageCode } from "@/lib/i18n";
import { toast } from "sonner";
import { dataStore, type EmployerWorker } from "@/lib/data-store";
import { uploadFileToFirebaseStorage, uploadDataUrlToFirebaseStorage } from "@/lib/storage-service";

const searchSchema = z.object({
  mode: z.string().optional().catch("login"),
  role: z.string().optional().catch("worker"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Login or Register — REAL JOB" },
      { name: "description", content: "Access worker profiles, post jobs, and manage job applications on REAL JOB." },
    ],
  }),
  component: AuthPage,
});

type AuthTranslations = {
  workerTitle: string;
  workerSubtitle: string;
  posterTitle: string;
  posterSubtitle: string;
  workerLoginTitle: string;
  posterLoginTitle: string;
  employeeLoginTitle: string;
  workerLoginSubtitle: string;
  posterLoginSubtitle: string;
  employeeLoginSubtitle: string;
  resetPasswordTitle: string;
  loginTab: string;
  registerTab: string;
  languageLabel: string;
  workerAndOwnerLabel: string;
  workerRole: string;
  ownerRole: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  companyNameLabel: string;
  companyNamePlaceholder: string;
  photoTitleWorker: string;
  photoTitleOwner: string;
  photoSubtitle: string;
  photoAttached: string;
  uploadPhoto: string;
  changePhoto: string;
  takePhoto: string;
  emailLabel: string;
  emailPlaceholder: string;
  loginEmailLabel: string;
  loginEmailPlaceholder: string;
  employeeMobileLabel: string;
  employeeMobilePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  sendOtp: string;
  resendOtp: string;
  otpLabel: string;
  otpPlaceholder: string;
  otpSentSuccess: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  employeePinLabel: string;
  employeePinPlaceholder: string;
  passwordOptionalHint: string;
  setCustomPassword: string;
  hideCustomPassword: string;
  customPasswordPlaceholder: string;
  registerBtn: string;
  verifyAndRegisterBtn: string;
  sendResetLink: string;
  signInBtn: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  signInLink: string;
  registerLink: string;
  forgotPasswordLink: string;
  rememberMe: string;
  cameraTitle: string;
  retakePhoto: string;
  usePhoto: string;
  snapPhoto: string;
};

const AUTH_TRANSLATIONS: Record<string, AuthTranslations> = {
  en: {
    workerTitle: "Worker / User Registration",
    workerSubtitle: "For job seekers: Create a new profile and start finding jobs.",
    posterTitle: "Job Poster Registration",
    posterSubtitle: "For employers & companies: Register an account to find workers.",
    workerLoginTitle: "Worker / User Login",
    posterLoginTitle: "Job Poster Login",
    employeeLoginTitle: "Employee Login",
    workerLoginSubtitle: "Please enter your email and password to log in and find jobs.",
    posterLoginSubtitle: "For employers & admins: Login to post jobs and search candidates.",
    employeeLoginSubtitle: "For existing factory employees: Enter mobile number & PIN to punch in.",
    resetPasswordTitle: "Reset Password",
    loginTab: "Login",
    registerTab: "Register",
    languageLabel: "Language *",
    workerAndOwnerLabel: "Worker and owner *",
    workerRole: "Worker",
    ownerRole: "Owner",
    fullNameLabel: "Full Name *",
    fullNamePlaceholder: "e.g. Rahul Sharma",
    companyNameLabel: "Company / Owner Name *",
    companyNamePlaceholder: "e.g. Tata Motors / L&T",
    photoTitleWorker: "Profile Photo",
    photoTitleOwner: "Company Logo / Photo",
    photoSubtitle: "Choose file or take live camera photo",
    photoAttached: "✓ Photo Attached",
    uploadPhoto: "Upload File",
    changePhoto: "Change",
    takePhoto: "Take Photo",
    emailLabel: "E-mail Address (Optional)",
    emailPlaceholder: "name@example.com (Optional)",
    loginEmailLabel: "Email Address or Mobile Number *",
    loginEmailPlaceholder: "Email or Mobile (e.g. 98220 00000 / user@gmail.com)",
    employeeMobileLabel: "Mobile Number *",
    employeeMobilePlaceholder: "e.g. 98220 00000",
    phoneLabel: "Phone No. *",
    phonePlaceholder: "98220 00000",
    sendOtp: "Send OTP",
    resendOtp: "Resend",
    otpLabel: "O.T.P *",
    otpPlaceholder: "Enter 6-digit OTP",
    otpSentSuccess: "OTP sent successfully. Please check your SMS.",
    passwordLabel: "Password *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "4-Digit PIN *",
    employeePinPlaceholder: "e.g. 1234",
    passwordOptionalHint: "Password: (Defaults to your mobile number)",
    setCustomPassword: "Set Custom",
    hideCustomPassword: "Hide",
    customPasswordPlaceholder: "Enter custom password (min 6 characters)",
    registerBtn: "Send OTP to Register",
    verifyAndRegisterBtn: "Verify OTP & Register",
    sendResetLink: "Send Reset Link",
    signInBtn: "Sign In",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    signInLink: "Sign In",
    registerLink: "Register",
    forgotPasswordLink: "Forgot Password?",
    rememberMe: "Remember me",
    cameraTitle: "Live Camera Capture",
    retakePhoto: "Retake",
    usePhoto: "Use Photo",
    snapPhoto: "Snap Photo",
  },
  mr: {
    workerTitle: "कामगार नोंदणी",
    workerSubtitle: "नोकरी शोधणाऱ्यांसाठी: नवीन प्रोफाईल तयार करा आणि काम मिळवा.",
    posterTitle: "जॉब पोस्टर नोंदणी",
    posterSubtitle: "कंपन्या व मालकांसाठी: कामगार शोधण्यासाठी खाते नोंदणी करा.",
    workerLoginTitle: "कामगार लॉगिन",
    posterLoginTitle: "जॉब पोस्टर लॉगिन",
    employeeLoginTitle: "कर्मचारी लॉगिन",
    workerLoginSubtitle: "लॉगिन करण्यासाठी कृपया ईमेल किंवा मोबाईल नंबर टाका.",
    posterLoginSubtitle: "मालक व कंपन्यांसाठी: कामगार शोधण्यासाठी लॉगिन करा.",
    employeeLoginSubtitle: "हजेरी नोंदवण्यासाठी मोबाईल नंबर आणि पिन टाका.",
    resetPasswordTitle: "पासवर्ड बदला",
    loginTab: "लॉगिन",
    registerTab: "नोंदणी",
    languageLabel: "भाषा *",
    workerAndOwnerLabel: "कामगार आणि मालक *",
    workerRole: "कामगार",
    ownerRole: "मालक",
    fullNameLabel: "पूर्ण नाव *",
    fullNamePlaceholder: "उदा. राहुल शर्मा",
    companyNameLabel: "कंपनी किंवा मालकाचे नाव *",
    companyNamePlaceholder: "उदा. टाटा मोटर्स / एल अँड टी",
    photoTitleWorker: "प्रोफाईल फोटो",
    photoTitleOwner: "कंपनी लोगो किंवा फोटो",
    photoSubtitle: "फाईल निवडा किंवा कॅमेऱ्यातून थेट फोटो काढा",
    photoAttached: "✓ फोटो जोडला गेला आहे",
    uploadPhoto: "फाईल अपलोड करा",
    changePhoto: "बदला",
    takePhoto: "कॅमेरा उघडा",
    emailLabel: "ई-मेल पत्ता (ऐच्छिक)",
    emailPlaceholder: "नाव@example.com (ऐच्छिक)",
    loginEmailLabel: "ईमेल किंवा मोबाईल नंबर *",
    loginEmailPlaceholder: "उदा. ९८२२० ००००० किंवा user@gmail.com",
    employeeMobileLabel: "मोबाईल नंबर *",
    employeeMobilePlaceholder: "उदा. ९८२२० ०००००",
    phoneLabel: "मोबाईल नंबर *",
    phonePlaceholder: "९८२२० ०००००",
    sendOtp: "OTP पाठवा",
    resendOtp: "पुन्हा पाठवा",
    otpLabel: "ओ.टी.पी (OTP) *",
    otpPlaceholder: "६-अंकी OTP टाका",
    otpSentSuccess: "मोबाईलवर OTP पाठवला आहे. कृपया SMS तपासा.",
    passwordLabel: "पासवर्ड *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "४-अंकी पिन *",
    employeePinPlaceholder: "उदा. १२३४",
    passwordOptionalHint: "पासवर्ड: (बाय डीफॉल्ट तुमचा मोबाईल नंबर राहील)",
    setCustomPassword: "पासवर्ड सेट करा",
    hideCustomPassword: "लपवा",
    customPasswordPlaceholder: "नवीन पासवर्ड टाका (किमान ६ अक्षरे)",
    registerBtn: "OTP पाठवा आणि नोंदणी करा",
    verifyAndRegisterBtn: "OTP तपासा आणि नोंदणी करा",
    sendResetLink: "रीसेट लिंक पाठवा",
    signInBtn: "साइन इन करा",
    alreadyHaveAccount: "आधीच खाते आहे का?",
    dontHaveAccount: "खाते नाही का?",
    signInLink: "साइन इन करा",
    registerLink: "नोंदणी करा",
    forgotPasswordLink: "पासवर्ड विसरलात?",
    rememberMe: "माझे लक्षात ठेवा",
    cameraTitle: "थेट फोटो काढा",
    retakePhoto: "पुन्हा काढा",
    usePhoto: "फोटो वापरा",
    snapPhoto: "फोटो काढा",
  },
  hi: {
    workerTitle: "श्रमिक पंजीकरण",
    workerSubtitle: "नौकरी चाहने वालों के लिए: नया प्रोफाइल बनाएं और काम पाएं।",
    posterTitle: "नियोक्ता पंजीकरण",
    posterSubtitle: "कंपनियों और मालिकों के लिए: कामगार खोजने के लिए खाता बनाएं।",
    workerLoginTitle: "श्रमिक लॉगिन",
    posterLoginTitle: "नियोक्ता लॉगिन",
    employeeLoginTitle: "कर्मचारी लॉगिन",
    workerLoginSubtitle: "लॉगिन करने के लिए कृपया ईमेल या मोबाइल नंबर दर्ज करें।",
    posterLoginSubtitle: "मालिकों के लिए: कामगार खोजने हेतु लॉगिन करें।",
    employeeLoginSubtitle: "हाजिरी दर्ज करने के लिए मोबाइल नंबर और पिन दर्ज करें।",
    resetPasswordTitle: "पासवर्ड रीसेट करें",
    loginTab: "लॉग इन",
    registerTab: "पंजीकरण",
    languageLabel: "भाषा *",
    workerAndOwnerLabel: "श्रमिक और मालिक *",
    workerRole: "श्रमिक",
    ownerRole: "मालिक",
    fullNameLabel: "पूरा नाम *",
    fullNamePlaceholder: "उदा. राहुल शर्मा",
    companyNameLabel: "कंपनी या मालिक का नाम *",
    companyNamePlaceholder: "उदा. टाटा मोटर्स / एल एंड टी",
    photoTitleWorker: "प्रोफ़ाइल फ़ोटो",
    photoTitleOwner: "कंपनी लोगो या फ़ोटो",
    photoSubtitle: "फ़ाइल चुनें या कैमरे से फ़ोटो लें",
    photoAttached: "✓ फ़ोटो संलग्न है",
    uploadPhoto: "फ़ाइल अपलोड करें",
    changePhoto: "बदलें",
    takePhoto: "फ़ोटो खींचें",
    emailLabel: "ई-मेल पता (वैकल्पिक)",
    emailPlaceholder: "name@example.com (वैकल्पिक)",
    loginEmailLabel: "ईमेल या मोबाइल नंबर *",
    loginEmailPlaceholder: "उदा. 98220 00000 या user@gmail.com",
    employeeMobileLabel: "मोबाइल नंबर *",
    employeeMobilePlaceholder: "उदा. 98220 00000",
    phoneLabel: "मोबाइल नंबर *",
    phonePlaceholder: "98220 00000",
    sendOtp: "OTP भेजें",
    resendOtp: "पुनः भेजें",
    otpLabel: "ओ.टी.पी (OTP) *",
    otpPlaceholder: "6-अंकों का OTP दर्ज करें",
    otpSentSuccess: "मोबाइल पर OTP भेजा गया है। कृपया SMS देखें।",
    passwordLabel: "पासवर्ड *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "4-अंकों का पिन *",
    employeePinPlaceholder: "उदा. 1234",
    passwordOptionalHint: "पासवर्ड: (डिफ़ॉल्ट रूप से आपका मोबाइल नंबर)",
    setCustomPassword: "पासवर्ड सेट करें",
    hideCustomPassword: "छिपाएं",
    customPasswordPlaceholder: "नया पासवर्ड दर्ज करें (न्यूनतम 6 अक्षर)",
    registerBtn: "OTP भेजें और पंजीकरण करें",
    verifyAndRegisterBtn: "OTP सत्यापित करें और रजिस्टर करें",
    sendResetLink: "रीसेट लिंक भेजें",
    signInBtn: "साइन इन करें",
    alreadyHaveAccount: "पहले से खाता है?",
    dontHaveAccount: "खाता नहीं है?",
    signInLink: "साइन इन करें",
    registerLink: "रजिस्टर करें",
    forgotPasswordLink: "पासवर्ड भूल गए?",
    rememberMe: "मुझे याद रखें",
    cameraTitle: "लाइव कैमरा से फोटो लें",
    retakePhoto: "दोबारा लें",
    usePhoto: "फोटो उपयोग करें",
    snapPhoto: "फोटो खींचें",
  },
  gu: {
    workerTitle: "કારીગર નોંધણી",
    workerSubtitle: "નોકરી શોધનારાઓ માટે: નવી પ્રોફાઇલ બનાવો અને કામ શોધો.",
    posterTitle: "એમ્પ્લોયર નોંધણી",
    posterSubtitle: "કંપનીઓ અને માલિકો માટે: કારીગરો શોધવા માટે એકાઉન્ટ બનાવો.",
    workerLoginTitle: "કારીગર લૉગિન",
    posterLoginTitle: "એમ્પ્લોયર લૉગિન",
    employeeLoginTitle: "કર્મચારી લૉગિન",
    workerLoginSubtitle: "લૉગિન કરવા માટે કૃપા કરીને ઇમેઇલ અથવા મોબાઇલ નંબર દાખલ કરો.",
    posterLoginSubtitle: "માલિકો માટે: કારીગરો શોધવા માટે લૉગિન કરો.",
    employeeLoginSubtitle: "મોબાઇલ નંબર અને પિન દાખલ કરો.",
    resetPasswordTitle: "પાસવર્ડ રીસેટ કરો",
    loginTab: "લૉગિન",
    registerTab: "નોંધણી",
    languageLabel: "ભાષા *",
    workerAndOwnerLabel: "કારીગર અને માલિક *",
    workerRole: "કારીગર",
    ownerRole: "માલિક",
    fullNameLabel: "પૂરું નામ *",
    fullNamePlaceholder: "દા.ત. રાહુલ શર્મા",
    companyNameLabel: "કંપની / માલિકનું નામ *",
    companyNamePlaceholder: "દા.ત. ટાટા મોટર્સ",
    photoTitleWorker: "પ્રોફાઇલ ફોટો",
    photoTitleOwner: "કંપની લોગો / ફોટો",
    photoSubtitle: "ફાઇલ પસંદ કરો અથવા કેમેરાથી ફોટો લો",
    photoAttached: "✓ ફોટો જોડાયેલ છે",
    uploadPhoto: "ફાઇલ અપલોડ કરો",
    changePhoto: "બદલો",
    takePhoto: "ફોટો પાડો",
    emailLabel: "ઇ-મેઇલ સરનામું (વૈકલ્પિક)",
    emailPlaceholder: "name@example.com (વૈકલ્પિક)",
    loginEmailLabel: "ઇમેઇલ અથવા મોબાઇલ નંબર *",
    loginEmailPlaceholder: "દા.ત. 98220 00000",
    employeeMobileLabel: "મોબાઇલ નંબર *",
    employeeMobilePlaceholder: "દા.ત. 98220 00000",
    phoneLabel: "મોબાઇલ નંબર *",
    phonePlaceholder: "98220 00000",
    sendOtp: "OTP મોકલો",
    resendOtp: "ફરી મોકલો",
    otpLabel: "ઓ.ટી.પી (OTP) *",
    otpPlaceholder: "6-અંકનો OTP દાખલ કરો",
    otpSentSuccess: "OTP સફળતાપૂર્વક મોકલવામાં આવ્યો.",
    passwordLabel: "પાસવર્ડ *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "4-અંકનો પિન *",
    employeePinPlaceholder: "દા.ત. 1234",
    passwordOptionalHint: "પાસવર્ડ: (મૂળભૂત રીતે તમારો મોબાઇલ નંબર)",
    setCustomPassword: "પાસવર્ડ સેટ કરો",
    hideCustomPassword: "છુપાવો",
    customPasswordPlaceholder: "નવો પાસવર્ડ દાખલ કરો (ઓછામાં ઓછા 6 અક્ષરો)",
    registerBtn: "OTP મોકલો અને નોંધણી કરો",
    verifyAndRegisterBtn: "OTP ચકાસો અને નોંધણી કરો",
    sendResetLink: "રીસેટ લિંક મોકલો",
    signInBtn: "સાઇન ઇન કરો",
    alreadyHaveAccount: "પહેલેથી ખાતું છે?",
    dontHaveAccount: "ખાતું નથી?",
    signInLink: "સાઇન ઇન કરો",
    registerLink: "નોંધણી કરો",
    forgotPasswordLink: "પાસવર્ડ ભૂલી ગયા છો?",
    rememberMe: "મને યાદ રાખો",
    cameraTitle: "લાઇવ કેમેરા કેપ્ચર",
    retakePhoto: "ફરીથી લો",
    usePhoto: "ફોટો વાપરો",
    snapPhoto: "ફોટો પાડો",
  },
  kn: {
    workerTitle: "ಕೆಲಸಗಾರ ನೋಂದಣಿ",
    workerSubtitle: "ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳಿಗೆ: ಹೊಸ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ ಮತ್ತು ಕೆಲಸ ಹುಡುಕಿ.",
    posterTitle: "ಉದ್ಯೋಗ ಪೋಸ್ಟರ್ ನೋಂದಣಿ",
    posterSubtitle: "ಉದ್ಯೋಗದಾತರು ಮತ್ತು ಕಂಪನಿಗಳಿಗೆ: ಖಾತೆ ನೋಂದಾಯಿಸಿ.",
    workerLoginTitle: "ಕೆಲಸಗಾರ ಲಾಗಿನ್",
    posterLoginTitle: "ಉದ್ಯೋಗ ಪೋಸ್ಟರ್ ಲಾಗಿನ್",
    employeeLoginTitle: "ನೌಕರರ ಲಾಗಿನ್",
    workerLoginSubtitle: "ಲಾಗಿನ್ ಮಾಡಲು ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    posterLoginSubtitle: "ಉದ್ಯೋಗದಾತರಿಗೆ: ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಲು ಲಾಗಿನ್ ಮಾಡಿ.",
    employeeLoginSubtitle: "ಹಾಜರಾತಿ ದಾಖಲಿಸಲು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಪಿನ್ ನಮೂದಿಸಿ.",
    resetPasswordTitle: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
    loginTab: "ಲಾಗಿನ್",
    registerTab: "ನೋಂದಣಿ",
    languageLabel: "ಭಾಷೆ *",
    workerAndOwnerLabel: "ಕೆಲಸಗಾರ ಮತ್ತು ಮಾಲೀಕರು *",
    workerRole: "ಕೆಲಸಗಾರ",
    ownerRole: "ಮಾಲೀಕರು",
    fullNameLabel: "ಪೂರ್ಣ ಹೆಸರು *",
    fullNamePlaceholder: "ಉದಾ. ರಾಹುಲ್ ಶರ್ಮಾ",
    companyNameLabel: "ಕಂಪನಿ ಅಥವಾ ಮಾಲೀಕರ ಹೆಸರು *",
    companyNamePlaceholder: "ಉದಾ. ಟಾಟಾ ಮೋಟಾರ್ಸ್",
    photoTitleWorker: "ಪ್ರೊಫೈಲ್ ಫೋಟೋ",
    photoTitleOwner: "ಕಂಪನಿ ಲೋಗೋ ಅಥವಾ ಫೋಟೋ",
    photoSubtitle: "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    photoAttached: "✓ ಫೋಟೋ ಲಗತ್ತಿಸಲಾಗಿದೆ",
    uploadPhoto: "ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    changePhoto: "ಬದಲಾಯಿಸಿ",
    takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    emailLabel: "ಇ-ಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)",
    emailPlaceholder: "name@example.com (ಐಚ್ಛಿಕ)",
    loginEmailLabel: "ಇಮೇಲ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *",
    loginEmailPlaceholder: "ಉದಾ. 98220 00000",
    employeeMobileLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *",
    employeeMobilePlaceholder: "ಉದಾ. 98220 00000",
    phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *",
    phonePlaceholder: "98220 00000",
    sendOtp: "OTP ಕಳುಹಿಸಿ",
    resendOtp: "ಮತ್ತೆ ಕಳುಹಿಸಿ",
    otpLabel: "ಒ.ಟಿ.ಪಿ (OTP) *",
    otpPlaceholder: "6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    otpSentSuccess: "OTP ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್ *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "4-ಅಂಕಿಯ ಪಿನ್ *",
    employeePinPlaceholder: "ಉದಾ. 1234",
    passwordOptionalHint: "ಪಾಸ್‌ವರ್ಡ್: (ಡೀಫಾಲ್ಟ್ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ)",
    setCustomPassword: "ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ",
    hideCustomPassword: "ಮರೆಮಾಡಿ",
    customPasswordPlaceholder: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು)",
    registerBtn: "OTP ಕಳುಹಿಸಿ ಮತ್ತು ನೋಂದಾಯಿಸಿ",
    verifyAndRegisterBtn: "OTP ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನೋಂದಾಯಿಸಿ",
    sendResetLink: "ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ",
    signInBtn: "ಸೈನ್ ಇನ್",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    dontHaveAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    signInLink: "ಸೈನ್ ಇನ್",
    registerLink: "ನೋಂದಣಿ",
    forgotPasswordLink: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    rememberMe: "ನನ್ನನ್ನು ನೆನಪಿಡಿ",
    cameraTitle: "ಲೈವ್ ಕ್ಯಾಮೆರಾ",
    retakePhoto: "ಮತ್ತೆ ತೆಗೆಯಿರಿ",
    usePhoto: "ಫೋಟೋ ಬಳಸಿ",
    snapPhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
  },
  te: {
    workerTitle: "వర్కర్ నమోదు",
    workerSubtitle: "ఉద్యోగార్థులకు: కొత్త ప్రొఫైల్ సృష్టించి పనిని పొందండి.",
    posterTitle: "ఎంప్లాయర్ నమోదు",
    posterSubtitle: "కంపెనీలు మరియు యజమానులకు: ఖాతాను నమోదు చేయండి.",
    workerLoginTitle: "వర్కర్ లాగిన్",
    posterLoginTitle: "ఎంప్లాయర్ లాగిన్",
    employeeLoginTitle: "ఉద్యోగి లాగిన్",
    workerLoginSubtitle: "లాగిన్ చేయడానికి ఇమెయిల్ లేదా మొబైల్ నంబర్ నమోదు చేయండి.",
    posterLoginSubtitle: "యజమానుల కోసం: పనివారిని శోధించడానికి లాగిన్ అవ్వండి.",
    employeeLoginSubtitle: "హాజరు కోసం మొబైల్ నంబర్ మరియు పిన్ నమోదు చేయండి.",
    resetPasswordTitle: "పాస్‌వర్డ్ రీసెట్ చేయండి",
    loginTab: "లాగిన్",
    registerTab: "నమోదు",
    languageLabel: "భాష *",
    workerAndOwnerLabel: "వర్కర్ మరియు యజమాని *",
    workerRole: "వర్కర్",
    ownerRole: "యజమాని",
    fullNameLabel: "పూర్తి పేరు *",
    fullNamePlaceholder: "ఉదా. రాహుల్ శర్మ",
    companyNameLabel: "కంపెనీ లేదా యజమాని పేరు *",
    companyNamePlaceholder: "ఉదా. టాటా మోటార్స్",
    photoTitleWorker: "ప్రొఫైల్ ఫోటో",
    photoTitleOwner: "కంపెనీ లోగో లేదా ఫోటో",
    photoSubtitle: "ఫైల్‌ను ఎంచుకోండి లేదా కెమెరాతో ఫోటో తీయండి",
    photoAttached: "✓ ఫోటో జతచేయబడింది",
    uploadPhoto: "ఫైల్ అప్‌లోడ్ చేయండి",
    changePhoto: "మార్చండి",
    takePhoto: "ఫోటో తీయండి",
    emailLabel: "ఇ-మెయిల్ చిరునామా (ఐచ్ఛికం)",
    emailPlaceholder: "name@example.com (ఐచ్ఛికం)",
    loginEmailLabel: "ఇమెయిల్ లేదా మొబైల్ నంబర్ *",
    loginEmailPlaceholder: "ఉదా. 98220 00000",
    employeeMobileLabel: "మొబైల్ నంబర్ *",
    employeeMobilePlaceholder: "ఉదా. 98220 00000",
    phoneLabel: "మొబైల్ నంబర్ *",
    phonePlaceholder: "98220 00000",
    sendOtp: "OTP పంపండి",
    resendOtp: "మళ్లీ పంపండి",
    otpLabel: "ఓ.టి.పి (OTP) *",
    otpPlaceholder: "6-అంకెల OTP నమోదు చేయండి",
    otpSentSuccess: "OTP విజయవంతంగా పంపబడింది.",
    passwordLabel: "పాస్‌వర్డ్ *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "4-అంకెల పిన్ *",
    employeePinPlaceholder: "ఉదా. 1234",
    passwordOptionalHint: "పాస్‌వర్డ్: (డిఫాల్ట్‌గా మీ మొబైల్ నంబర్)",
    setCustomPassword: "పాస్‌వర్డ్ సెట్ చేయండి",
    hideCustomPassword: "దాచండి",
    customPasswordPlaceholder: "కొత్త పాస్‌వర్డ్ నమోదు చేయండి (కనీసం 6 అక్షరాలు)",
    registerBtn: "OTP పంపండి మరియు నమోదు చేయండి",
    verifyAndRegisterBtn: "OTP ధృవీకరించి నమోదు చేయండి",
    sendResetLink: "రీసెట్ లింక్ పంపండి",
    signInBtn: "సైన్ ఇన్",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    dontHaveAccount: "ఖాతా లేదా?",
    signInLink: "సైన్ ఇన్",
    registerLink: "నమోదు",
    forgotPasswordLink: "పాస్‌వర్డ్ మర్చిపోయారా?",
    rememberMe: "నన్ను గుర్తుంచుకో",
    cameraTitle: "లైవ్ కెమెరా",
    retakePhoto: "మళ్లీ తీయండి",
    usePhoto: "ఫోటో ఉపయోగించండి",
    snapPhoto: "ఫోటో తీయండి",
  },
  ta: {
    workerTitle: "பணியாளர் பதிவு",
    workerSubtitle: "வேலை தேடுபவர்களுக்கு: சுயவிவரத்தை உருவாக்கி வேலை பெறுங்கள்.",
    posterTitle: "முதலாளி பதிவு",
    posterSubtitle: "நிறுவனங்களுக்கு: கணக்கைப் பதிவு செய்யவும்.",
    workerLoginTitle: "பணியாளர் உள்நுழைவு",
    posterLoginTitle: "முதலாளி உள்நுழைவு",
    employeeLoginTitle: "ஊழியர் உள்நுழைவு",
    workerLoginSubtitle: "உள்நுழைய மின்னஞ்சல் அல்லது மொபைல் எண்ணை உள்ளிடவும்.",
    posterLoginSubtitle: "முதலாளிகளுக்கு: பணியாளர்களைக் கண்டறிய உள்நுழையவும்.",
    employeeLoginSubtitle: "வருகையைப் பதிவு செய்ய மொபைல் எண் மற்றும் பின்னை உள்ளிடவும்.",
    resetPasswordTitle: "கடவுச்சொல்லை மீட்டமை",
    loginTab: "உள்நுழைவு",
    registerTab: "பதிவு",
    languageLabel: "மொழி *",
    workerAndOwnerLabel: "பணியாளர் மற்றும் முதலாளி *",
    workerRole: "பணியாளர்",
    ownerRole: "முதலாளி",
    fullNameLabel: "முழு பெயர் *",
    fullNamePlaceholder: "எ.கா. ராகுல் சர்மா",
    companyNameLabel: "நிறுவனம் அல்லது முதலாளி பெயர் *",
    companyNamePlaceholder: "எ.கா. டாடா மோட்டார்ஸ்",
    photoTitleWorker: "சுயவிவரப் படம்",
    photoTitleOwner: "நிறுவன லோகோ அல்லது படம்",
    photoSubtitle: "கோப்பைத் தேர்ந்தெடுக்கவும் அல்லது கேமரா படம் எடுக்கவும்",
    photoAttached: "✓ படம் இணைக்கப்பட்டது",
    uploadPhoto: "பதிவேற்றவும்",
    changePhoto: "மாற்றவும்",
    takePhoto: "படம் எடுங்கள்",
    emailLabel: "மின்னஞ்சல் முகவரி (விருப்பத்தேர்வு)",
    emailPlaceholder: "name@example.com (விருப்பத்தேர்வு)",
    loginEmailLabel: "மின்னஞ்சல் அல்லது மொபைல் எண் *",
    loginEmailPlaceholder: "எ.கா. 98220 00000",
    employeeMobileLabel: "மொபைல் எண் *",
    employeeMobilePlaceholder: "எ.கா. 98220 00000",
    phoneLabel: "மொபைல் எண் *",
    phonePlaceholder: "98220 00000",
    sendOtp: "OTP அனுப்பு",
    resendOtp: "மீண்டும் அனுப்பு",
    otpLabel: "OTP *",
    otpPlaceholder: "6-இலக்க OTP உள்ளிடவும்",
    otpSentSuccess: "OTP வெற்றிகரமாக அனுப்பப்பட்டது.",
    passwordLabel: "கடவுச்சொல் *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "4-இலக்க பின் *",
    employeePinPlaceholder: "எ.கா. 1234",
    passwordOptionalHint: "கடவுச்சொல்: (இயல்புநிலையாக உங்கள் மொபைல் எண்)",
    setCustomPassword: "கடவுச்சொல்லை அமைக்கவும்",
    hideCustomPassword: "மறைக்கவும்",
    customPasswordPlaceholder: "புதிய கடவுச்சொல்லை உள்ளிடவும் (குறைந்தது 6 எழுத்துக்கள்)",
    registerBtn: "OTP அனுப்பி பதிவு செய்யவும்",
    verifyAndRegisterBtn: "OTP சரிபார்த்து பதிவு செய்யவும்",
    sendResetLink: "இணைப்பை அனுப்பு",
    signInBtn: "உள்நுழைய",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    dontHaveAccount: "கணக்கு இல்லையா?",
    signInLink: "உள்நுழைய",
    registerLink: "பதிவு செய்ய",
    forgotPasswordLink: "கடவுச்சொல் மறந்துவிட்டதா?",
    rememberMe: "என்னை நினைவில் கொள்",
    cameraTitle: "நேரடி கேமரா",
    retakePhoto: "மீண்டும் எடுங்கள்",
    usePhoto: "படத்தைப் பயன்படுத்துங்கள்",
    snapPhoto: "படம் எடுங்கள்",
  },
  bn: {
    workerTitle: "শ্রমিক নিবন্ধন",
    workerSubtitle: "চাকরি সন্ধানীদের জন্য: প্রোফাইল তৈরি করুন এবং কাজ পান।",
    posterTitle: "নিয়োগকারী নিবন্ধন",
    posterSubtitle: "কোম্পানি ও মালিকদের জন্য: অ্যাকাউন্ট নিবন্ধন করুন।",
    workerLoginTitle: "শ্রমিক লগইন",
    posterLoginTitle: "নিয়োগকারী লগইন",
    employeeLoginTitle: "কর্মচারী লগইন",
    workerLoginSubtitle: "লগইন করতে অনুগ্রহ করে ইমেল বা মোবাইল নম্বর লিখুন।",
    posterLoginSubtitle: "মালিকদের জন্য: কর্মী খুঁজতে লগইন করুন।",
    employeeLoginSubtitle: "হাজিরার জন্য মোবাইল নম্বর এবং পিন দিন।",
    resetPasswordTitle: "পাসওয়ার্ড রিসেট করুন",
    loginTab: "লগইন",
    registerTab: "নিবন্ধন",
    languageLabel: "ভাষা *",
    workerAndOwnerLabel: "শ্রমিক ও মালিক *",
    workerRole: "শ্রমिक",
    ownerRole: "মালিক",
    fullNameLabel: "পুরো নাম *",
    fullNamePlaceholder: "যেমন: রাহুল শর্মা",
    companyNameLabel: "কোম্পানি বা মালিকের নাম *",
    companyNamePlaceholder: "যেমন: টাটা মোটরস",
    photoTitleWorker: "প্রোফাইল ছবি",
    photoTitleOwner: "কোম্পানি লোগো বা ছবি",
    photoSubtitle: "ফাইল নির্বাচন করুন বা ক্যামেরা দিয়ে ছবি তুলুন",
    photoAttached: "✓ ছবি সংযুক্ত হয়েছে",
    uploadPhoto: "ফাইল আপলোড করুন",
    changePhoto: "পরিবর্তন করুন",
    takePhoto: "ছবি তুলুন",
    emailLabel: "ই-মেইল ঠিকানা (ঐচ্ছিক)",
    emailPlaceholder: "name@example.com (ঐচ্ছিক)",
    loginEmailLabel: "ইমেল বা মোবাইল নম্বর *",
    loginEmailPlaceholder: "যেমন: 98220 00000",
    employeeMobileLabel: "মোবাইল নম্বর *",
    employeeMobilePlaceholder: "যেমন: 98220 00000",
    phoneLabel: "মোবাইল নম্বর *",
    phonePlaceholder: "98220 00000",
    sendOtp: "OTP পাঠান",
    resendOtp: "পুনরায় পাঠান",
    otpLabel: "ওটিপি (OTP) *",
    otpPlaceholder: "৬-সংখ্যার OTP দিন",
    otpSentSuccess: "OTP সফলভাবে পাঠানো হয়েছে।",
    passwordLabel: "পাসওয়ার্ড *",
    passwordPlaceholder: "••••••••",
    employeePinLabel: "৪-সংখ্যার পিন *",
    employeePinPlaceholder: "যেমন: 1234",
    passwordOptionalHint: "পাসওয়ার্ড: (ডিফল্ট আপনার মোবাইল নম্বর)",
    setCustomPassword: "পাসওয়ার্ড সেট করুন",
    hideCustomPassword: "লুকান",
    customPasswordPlaceholder: "নতুন পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)",
    registerBtn: "OTP পাঠান ও নিবন্ধন করুন",
    verifyAndRegisterBtn: "OTP যাচাই ও নিবন্ধন করুন",
    sendResetLink: "রিসেট লিংক পাঠান",
    signInBtn: "সাইন ইন",
    alreadyHaveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    dontHaveAccount: "অ্যাকাউন্ট নেই?",
    signInLink: "সাইন ইন",
    registerLink: "নিবন্ধন",
    forgotPasswordLink: "পাসওয়ার্ড ভুলে গেছেন?",
    rememberMe: "আমাকে মনে রাখুন",
    cameraTitle: "লাইভ ক্যামেরা",
    retakePhoto: "আবার তুলুন",
    usePhoto: "ছবি ব্যবহার করুন",
    snapPhoto: "ছবি তুলুন",
  },
};

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { lang, setLang } = useI18n();
  const str: AuthTranslations = ((AUTH_TRANSLATIONS as any)[lang] || (AUTH_TRANSLATIONS as any)["en"]) as AuthTranslations;

  const [mode, setMode] = useState<"login" | "register" | "forgot">((search.mode as any) || "login");
  const [role, setRole] = useState<"worker" | "employer" | "admin" | "employee">((search.role as any) || "worker");
  const [showPassword, setShowPassword] = useState(false);
  const [showCustomPassword, setShowCustomPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  // SYNC_SEARCH_PARAMS_EFFECT
  useEffect(() => {
    if (search.mode && (search.mode === "login" || search.mode === "register" || search.mode === "forgot")) {
      setMode(search.mode as any);
    }
    if (search.role) {
      const r = search.role.toLowerCase();
      if (r === "admin" || r === "employer" || r === "poster") {
        setRole("admin");
      } else if (r === "employee") {
        setRole("employee");
      } else {
        setRole("worker");
      }
    }
  }, [search.mode, search.role]);
  const [rememberMe, setRememberMe] = useState(true);

  // Common credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  // WebCam Camera state
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [tempCaptured, setTempCaptured] = useState<string | null>(null);

  // Reset OTP states on mode switch
  useEffect(() => {
    setShowOtpField(false);
    setInputOtp("");
    setServerOtp("");
    setResendCooldown(0);
    if (role === "employee") {
      setMode("login");
    }
  }, [mode, role]);

  // Handle live camera stream attachment when camera open
  useEffect(() => {
    if (cameraOpen && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [cameraOpen, mediaStream]);

  const startCamera = async () => {
    try {
      setTempCaptured(null);
      setCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      setMediaStream(stream);
    } catch (err) {
      toast.error(lang === "mr" ? "कॅमेरा उघडता आला नाही! कृपया कॅमेरा परवानगी तपासा." : "Could not open camera. Please check camera permissions.");
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    setCameraOpen(false);
    setTempCaptured(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setTempCaptured(dataUrl);
      }
    }
  };

  const confirmCapturedPhoto = async () => {
    if (tempCaptured) {
      stopCamera();
      const tId = toast.loading("Uploading photo to Firebase Storage...");
      try {
        const res = await uploadDataUrlToFirebaseStorage(tempCaptured, "profile-photos", `cam_${Date.now()}.jpg`);
        setProfilePhoto(res.downloadUrl);
        toast.dismiss(tId);
        toast.success(lang === "mr" ? "फोटो कॅमेऱ्यातून यशस्वीरीत्या घेतला!" : "Photo captured & uploaded successfully!");
      } catch {
        toast.dismiss(tId);
        setProfilePhoto(tempCaptured);
        toast.success(lang === "mr" ? "फोटो कॅमेऱ्यातून घेतला!" : "Photo captured successfully!");
      }
    } else {
      stopCamera();
    }
  };

  // Worker registration extra fields
  const [workerName, setWorkerName] = useState("");
  const [workerPhone, setWorkerPhone] = useState("");

  // Employer registration extra fields
  const [companyName, setCompanyName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");

  // OTP Registration Verification
  const [showOtpField, setShowOtpField] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Timer countdown for Resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendOtpToMobile = async (mobileNum: string) => {
    if (!mobileNum || mobileNum.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number for OTP verification.");
      return false;
    }

    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    setServerOtp(generatedOtp);

    const username = "Experts";
    const authkey = "ba9dcdcdfcXX";
    const senderId = "EXTSKL";
    const accusage = "1";
    let message = `Your Verification Code for login is ${generatedOtp}. - Expertskill Technology.`;
    message = message.split(" ").join("%20");

    const url = `https://mobicomm.dove-sms.com/submitsms.jsp?user=${username}&key=${authkey}&mobile=+91${mobileNum}&message=${message}&accusage=${accusage}&senderid=${senderId}`;

    try {
      fetch(url)
        .then((res) => res.text())
        .then((text) => {
          console.log("SMS API Response:", text);
          if (text.toLowerCase().includes("success")) {
            toast.success("✅ तुमच्या मोबाईलवर OTP पाठवला आहे! (OTP sent to your mobile)");
          } else {
            toast.error(`SMS Error: ${text}`);
          }
        })
        .catch((err) => {
          console.error("SMS Fetch Error", err);
          toast.success("✅ तुमच्या मोबाईलवर OTP पाठवला आहे! (OTP sent to your mobile)");
        });
    } catch (err) {
      console.error("SMS API Error", err);
    }

    setShowOtpField(true);
    setResendCooldown(30);
    return true;
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    const userMobile = (role === "employer" || role === "admin") ? employerPhone : workerPhone;
    setIsResending(true);
    setInputOtp("");
    await sendOtpToMobile(userMobile);
    setIsResending(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB");
        return;
      }
      const tId = toast.loading("Uploading photo to Firebase Storage...");
      try {
        const res = await uploadFileToFirebaseStorage(file, "profile-photos", `${Date.now()}_${file.name}`);
        setProfilePhoto(res.downloadUrl);
        toast.dismiss(tId);
        toast.success(res.isFirebaseStorage ? "✅ Photo uploaded to Firebase Storage!" : "✓ Photo attached!");
      } catch (err) {
        toast.dismiss(tId);
        toast.error("Failed to upload photo");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "forgot") {
        const { getAuth, sendPasswordResetEmail } = await import("firebase/auth");
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent! Check your inbox.");
        setMode("login");
        setBusy(false);
        return;
      }

      if (mode === "register") {
        const rawName = role === "employer" || role === "admin" ? companyName : workerName;
        const userMobile = ((role === "employer" || role === "admin") ? employerPhone : workerPhone).replace(/\D/g, "");

        if (!rawName.trim()) {
          toast.error(role === "employer" || role === "admin" ? "Please enter Company or Owner Name." : "Please enter your Full Name.");
          setBusy(false);
          return;
        }

        if (!userMobile || userMobile.length !== 10) {
          toast.error("Please enter a valid 10-digit mobile number.");
          setBusy(false);
          return;
        }

        if (!showOtpField) {
          await sendOtpToMobile(userMobile);
          setBusy(false);
          return;
        }

        if (showOtpField) {
          if (!inputOtp || inputOtp.trim().length !== 6) {
            toast.error("Please enter the 6-digit OTP sent to your mobile.");
            setBusy(false);
            return;
          }
          if (inputOtp.trim() !== serverOtp.trim()) {
            toast.error("Invalid OTP! Please try again.");
            setBusy(false);
            return;
          }
        }

        // Proceed to save user if OTP verified
        let finalEmail = email.trim().toLowerCase();
        if (!finalEmail && userMobile) {
          finalEmail = `${userMobile}@realjob.com`;
        }
        const nameString = (rawName && rawName.trim()) ? rawName.trim() : (finalEmail ? (finalEmail.split("@")[0] || "User") : "User");

        // Fallback password if user did not enter a custom password
        const finalPassword = password.trim().length >= 6
          ? password.trim()
          : (userMobile.length >= 6 ? userMobile : "RealJob@123");

        const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import("firebase/auth");
        const { getFirestore, doc, setDoc } = await import("firebase/firestore");
        const auth = getAuth();
        const db = getFirestore();

        let uid: string;
        try {
          const credential = await createUserWithEmailAndPassword(auth, finalEmail, finalPassword);
          uid = credential.user.uid;
        } catch (createErr: any) {
          if (createErr?.code === "auth/email-already-in-use") {
            try {
              const signCred = await signInWithEmailAndPassword(auth, finalEmail, finalPassword);
              uid = signCred.user.uid;
            } catch {
              throw createErr;
            }
          } else {
            throw createErr;
          }
        }

        let finalPhoto = profilePhoto || "";
        if (finalPhoto && finalPhoto.startsWith("data:")) {
          try {
            const res = await uploadDataUrlToFirebaseStorage(finalPhoto, "profile-photos", `${uid}_profile.jpg`);
            finalPhoto = res.downloadUrl;
          } catch (e) {
            console.warn("Storage upload fallback", e);
          }
        }

        const userObj = {
          id: uid,
          email: finalEmail,
          password: finalPassword,
          role: role === "admin" ? "employer" : role,
          fullName: nameString,
          mobile: userMobile || "",
          profilePhoto: finalPhoto,
        };

        // Save to Firestore
        await setDoc(doc(db, "users", uid), userObj);

        // Also save to dataStore for backwards compatibility across the app
        dataStore.registerAccount(userObj);

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success("✅ खाते यशस्वीरित्या तयार झाले! Welcome to REAL JOB.");
        if (role === "admin" || role === "employer") {
          navigate({ to: "/admin", search: { tab: "overview" }, replace: true });
        } else {
          navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
        }
        setBusy(false);
        return;
      }

      // ── LOGIN MODE ──
      let enteredEmail = email.trim().toLowerCase();
      // If user entered only digits (a mobile number), append @realjob.com for Firebase Auth compatibility
      const justDigits = enteredEmail.replace(/\D/g, "");
      if (justDigits.length >= 10 && enteredEmail.replace(/[\s\-\+\(\)]/g, "") === justDigits) {
        enteredEmail = `${justDigits}@realjob.com`;
      }

      if (enteredEmail === "supera@gmail.com" || enteredEmail === "superadmin") {
        // Super Admin Master Account
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("firebase/auth");
        const auth = getAuth();
        let uid = "superadmin-uid";

        try {
          const credential = await signInWithEmailAndPassword(auth, "supera@gmail.com", password);
          uid = credential.user.uid;
        } catch (signInErr: any) {
          const errCode = signInErr?.code || "";
          if ((errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") && password === "supera123") {
            try {
              const newCred = await createUserWithEmailAndPassword(auth, "supera@gmail.com", password);
              uid = newCred.user.uid;
            } catch {
              // fallback
            }
          } else if (password !== "supera123") {
            toast.error("❌ चुकीचा पासवर्ड! Super Admin password is 'supera123'.");
            setBusy(false);
            return;
          }
        }

        const userObj = {
          id: uid,
          email: "supera@gmail.com",
          role: "admin" as const,
          fullName: "Super Admin",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success("✅ Super Admin Login Successful!");
        navigate({ to: "/superadmin" });
        setBusy(false);
        return;
      }

      let existingAccount: any = undefined;

      if (role === "employee") {
        // for employee, enteredEmail is actually their mobile number
        const searchMobile = enteredEmail.replace(/\D/g, "");
        const allEmployerWorkers = (dataStore as any).getAllEmployerWorkers ? (dataStore as any).getAllEmployerWorkers() : [];

        const deletedIds = new Set<string>(
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("realjob_deleted_worker_ids") || "[]")
            : []
        );
        deletedIds.add("empw-1791635953540");
        deletedIds.add("empw-1791785681836");

        let candidates = allEmployerWorkers.filter((w: any) => {
          const clean = (w.mobile || "").replace(/\D/g, "");
          return clean === searchMobile &&
            !deletedIds.has(w.id) &&
            w.status !== "Inactive" &&
            w.status !== "Deleted" &&
            !w.isDeleted;
        });

        // In case candidates not yet loaded into localStorage, check directly from Firestore
        if (candidates.length === 0) {
          try {
            const { getFirestore, collection, getDocs } = await import("firebase/firestore");
            const db = getFirestore();
            const qSnap = await getDocs(collection(db, "workers"));
            const fbCandidates: any[] = [];
            qSnap.forEach((docSnap) => {
              const data = docSnap.data() as EmployerWorker;
              const m = (data.mobile || "").replace(/\D/g, "");
              if (
                m === searchMobile &&
                !deletedIds.has(docSnap.id) &&
                !deletedIds.has(data.id) &&
                data.status !== "Inactive" &&
                data.status !== "Deleted" &&
                !data.isDeleted
              ) {
                fbCandidates.push({ ...data, id: docSnap.id });
              }
            });
            if (fbCandidates.length > 0) {
              candidates = fbCandidates;
            }
          } catch { }
        }

        if (candidates.length === 0) {
          toast.error("❌ हा कर्मचारी सध्या सक्रिय नाही किंवा काढून टाकला आहे! (Employee not found or has been removed.)");
          setBusy(false);
          return;
        }

        // Sort newest first so most recently added profile matches
        candidates.sort((a: any, b: any) => (b.id || "").localeCompare(a.id || ""));

        existingAccount = candidates.find((c: any) => (c.pin || "1234") === password);

        if (!existingAccount) {
          toast.error("❌ चुकीचा पासकोड! (Wrong PIN. Please enter correct PIN.)");
          setBusy(false);
          return;
        }

      } else {
        const { getAuth, signInWithEmailAndPassword } = await import("firebase/auth");
        const { getFirestore, doc, getDoc } = await import("firebase/firestore");
        const auth = getAuth();
        const db = getFirestore();

        try {
          const credential = await signInWithEmailAndPassword(auth, enteredEmail, password);
          const uid = credential.user.uid;
          const userDoc = await getDoc(doc(db, "users", uid));

          if (userDoc.exists()) {
            existingAccount = userDoc.data();
            // Keep local store cache in sync with actual Firebase record
            dataStore.registerAccount({ ...(existingAccount as any), id: uid });
          } else {
            // Self-heal: User authenticated successfully in Firebase Auth, but Firestore doc was missing
            const fallbackRole = role === "worker" ? "worker" : "employer";
            const cleanName = credential.user.displayName || (enteredEmail.split("@")[0] || "User");
            const reconstructedUser: any = {
              id: uid,
              email: credential.user.email || enteredEmail,
              role: fallbackRole,
              fullName: cleanName,
              mobile: credential.user.phoneNumber || "",
              profilePhoto: credential.user.photoURL || "",
              createdAt: new Date().toISOString(),
            };
            const { setDoc } = await import("firebase/firestore");
            await setDoc(doc(db, "users", uid), reconstructedUser).catch(() => { });
            existingAccount = reconstructedUser;
            dataStore.registerAccount(reconstructedUser);
          }
        } catch (firebaseErr: any) {
          console.error("Firebase Login Error:", firebaseErr);
          const code = firebaseErr?.code || "";
          if (code === "auth/user-not-found" || code === "auth/invalid-credential" || code === "auth/wrong-password") {
            toast.error("❌ चुकीचा ईमेल किंवा पासवर्ड! किंवा खाते अस्तित्वात नाही.");
          } else if (code === "auth/too-many-requests") {
            toast.error("⚠️ अनेक अयशस्वी प्रयत्नांमुळे खाते तात्पुरते ब्लॉक झाले आहे. कृपया थोड्या वेळाने प्रयत्न करा.");
          } else {
            toast.error(firebaseErr?.message || "❌ लॉगिन अयशस्वी झाले. खाते अस्तित्वात नाही.");
          }
          setBusy(false);
          return;
        }
      }

      if (existingAccount) {
        const accRole = (existingAccount.role || "").toLowerCase();

        // Role isolation: prevent employer logging in on seeker tab, and vice versa
        if (role === "worker") {
          if (accRole === "employer" || accRole === "admin" || accRole === "poster") {
            toast.error("❌ हे Job Poster (Employer) चे खाते आहे! कृपया 'Job Poster Login' मधून लॉगिन करा.");
            setBusy(false);
            return;
          }
        } else if (role === "admin" || role === "employer") {
          if (accRole === "worker" || accRole === "seeker") {
            toast.error("❌ हे Job Seeker (उमेदवार) चे खाते आहे! कृपया 'Seeker Login' मधून लॉगिन करा.");
            setBusy(false);
            return;
          }
        }

        let resolvedEmpName = (existingAccount as any)?.employerName || "";
        if (!resolvedEmpName && existingAccount.employerId) {
          const accounts = (dataStore as any).getRegisteredUserAccounts ? (dataStore as any).getRegisteredUserAccounts() : [];
          const emp = accounts.find((a: any) =>
            a.id === existingAccount.employerId ||
            a.email === existingAccount.employerId ||
            a.fullName === existingAccount.employerId
          );
          if (emp) {
            resolvedEmpName = emp.companyName || emp.fullName || "";
          }
        }
        if (!resolvedEmpName && role === "employee") {
          resolvedEmpName = "Alpha Byte";
        }

        const userObj: any = {
          id: existingAccount.id,
          employerId: existingAccount.employerId || "",
          employerName: resolvedEmpName,
          email: existingAccount.email || `${existingAccount.mobile}@employee.local`,
          role: role === "employee" ? "employee" : (role === "admin" ? "employer" : role) as any,
          fullName: existingAccount.fullName || existingAccount.name || "User",
          mobile: existingAccount.mobile || "",
          profilePhoto: existingAccount.profilePhoto || "",
          locationType: existingAccount.locationType || "fixed",
          attendanceMode: existingAccount.attendanceMode || "punch",
        };

        window.localStorage.setItem("realjob-user", JSON.stringify(userObj));
        dataStore.setCurrentUser(userObj);
        toast.success(`✅ स्वागत आहे, ${existingAccount.fullName}! Welcome back.`);
        const isEmpOrAdmin = userObj.role === "employer" || userObj.role === "admin" || role === "admin" || role === "employer";
        if (isEmpOrAdmin) {
          navigate({ to: "/admin", search: { tab: "overview" }, replace: true });
        } else if (userObj.role === "employee" || role === "employee") {
          navigate({ to: "/employee-dashboard" as any, replace: true });
        } else {
          navigate({ to: "/dashboard", search: { tab: "overview" }, replace: true });
        }
      } else {
        toast.error("❌ खाते अस्तित्वात नाही! कृपया प्रथम नोंदणी (Register) करा.");
        setBusy(false);
        return;
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("❌ चुकीचा पासवर्ड किंवा ईमेल! (Invalid Password or Email)");
      } else if (code === "auth/user-not-found") {
        toast.error("❌ हा यूझर सापडला नाही. User not found.");
      } else if (code === "auth/email-already-in-use") {
        toast.error("❌ हा ईमेल आधीच वापरलेला आहे! कृपया लॉगिन (Sign In) करा किंवा दुसरा ईमेल वापरा. (Email already registered.)");
      } else if (code === "auth/weak-password") {
        toast.error("❌ पासवर्ड किमान ६ अक्षरांचा असावा! (Password should be at least 6 characters.)");
      } else {
        const prefix = mode === "register" ? "Registration Failed" : "Login Failed";
        toast.error(`${prefix}: ${err?.message || "Unknown error"}`);
      }
    } finally {
      setBusy(false);
    }
  };



  return (
    <div
      className="h-screen w-full overflow-hidden relative flex items-center justify-center bg-cover bg-center bg-no-repeat p-3 sm:p-4"
      style={{
        backgroundImage: `url('/office_desk_bg.png')`,
      }}
    >
      {/* Background Soft Dark Overlay */}
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px] pointer-events-none" />

      {/* Top Left Floating Home Button */}
      <div className="absolute left-4 top-3.5 z-20">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="bg-white/85 hover:bg-white text-[#0A3B7B] font-bold text-xs rounded-full shadow-md backdrop-blur-md px-3.5 py-1.5 h-8 border border-white/70"
        >
          <Link to="/" hash="main" replace={true} onClick={() => window.scrollTo(0, 0)}>
            <ArrowLeft className="mr-1 size-3.5" /> Home
          </Link>
        </Button>
      </div>



      {/* Centered Frosted Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-[420px] max-h-[92vh] overflow-y-auto bg-white/85 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300">

        {/* Top Logo */}
        <div className="flex justify-center mb-1.5">
          <LogoIcon className="h-9 sm:h-10 object-contain" />
        </div>

        {/* Title Header */}
        <div className="text-center space-y-1 mb-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-[#0A3B7B] tracking-tight leading-tight">
            {role === "admin"
              ? mode === "register"
                ? str.posterTitle
                : mode === "forgot"
                  ? str.resetPasswordTitle
                  : str.posterLoginTitle
              : role === "employee"
                ? str.employeeLoginTitle
                : mode === "register"
                  ? str.workerTitle
                  : mode === "forgot"
                    ? str.resetPasswordTitle
                    : str.workerLoginTitle}
          </h1>

          <p className="text-xs sm:text-[13px] font-semibold text-gray-600 px-1 leading-snug">
            {role === "admin"
              ? mode === "register"
                ? str.posterSubtitle
                : str.posterLoginSubtitle
              : role === "employee"
                ? str.employeeLoginSubtitle
                : mode === "register"
                  ? str.workerSubtitle
                  : str.workerLoginSubtitle}
          </p>
        </div>

        {/* Mode Pill Toggle (Login / Register) */}
        {mode !== "forgot" && role !== "employee" && (
          <div className="bg-gray-200/80 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-white/70 flex items-center shadow-inner mb-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-sm sm:text-[15px] font-black transition-all duration-200 flex items-center justify-center gap-2 ${mode === "login"
                ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                : "text-gray-700 hover:text-black font-extrabold"
                }`}
            >
              <User className="size-4 sm:size-4.5" /> {str.loginTab}
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 sm:py-2 rounded-full text-sm sm:text-[15px] font-black transition-all duration-200 flex items-center justify-center gap-2 ${mode === "register"
                ? "bg-[#0A3B7B] text-white shadow-md shadow-[#0A3B7B]/30"
                : "text-gray-700 hover:text-black font-extrabold"
                }`}
            >
              <UserPlus className="size-4 sm:size-4.5" /> {str.registerTab}
            </button>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">

          {/* ============================================================ */}
          {/* REGISTRATION FORM (ORIGINAL REAL JOB THEME + ADDED FIELDS)   */}
          {/* ============================================================ */}
          {mode === "register" && (
            <>
              {/* 1. Language Selection */}
              <div>
                <Label htmlFor="reg-lang" className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
                  {str.languageLabel}
                </Label>
                <div className="relative">
                  <Languages className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#0A3B7B]" />
                  <select
                    id="reg-lang"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs cursor-pointer"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code} className="text-gray-900 bg-white font-bold">
                        {l.code === "en" ? "English" : `${l.native} (${l.name})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. Worker and owner (Role Switcher) */}
              <div>
                <Label className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
                  {str.workerAndOwnerLabel}
                </Label>
                <div className="bg-gray-100/90 p-1 rounded-xl flex items-center gap-1.5 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs sm:text-[13px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${role === "worker"
                      ? "bg-[#0A3B7B] text-white shadow-xs"
                      : "bg-transparent text-gray-700 hover:text-black font-extrabold"
                      }`}
                  >
                    <User className="size-3.5" /> {str.workerRole}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs sm:text-[13px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${role === "admin" || role === "employer"
                      ? "bg-[#0A3B7B] text-white shadow-xs"
                      : "bg-transparent text-gray-700 hover:text-black font-extrabold"
                      }`}
                  >
                    <Building2 className="size-3.5" /> {str.ownerRole}
                  </button>
                </div>
              </div>

              {/* 3. Name Field */}
              <div>
                <Label className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
                  {role === "admin" || role === "employer" ? str.companyNameLabel : str.fullNameLabel}
                </Label>
                <div className="relative">
                  {role === "admin" || role === "employer" ? (
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  ) : (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  )}
                  <input
                    required
                    type="text"
                    autoComplete="off"
                    placeholder={role === "admin" || role === "employer" ? str.companyNamePlaceholder : str.fullNamePlaceholder}
                    value={role === "admin" || role === "employer" ? companyName : workerName}
                    onChange={(e) => {
                      if (role === "admin" || role === "employer") {
                        setCompanyName(e.target.value);
                      } else {
                        setWorkerName(e.target.value);
                      }
                    }}
                    className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                  />
                </div>
              </div>

              {/* 4. Profile / Company Photo Upload & Live Camera */}
              <div className="bg-blue-50/80 p-2 sm:p-2.5 rounded-xl border border-blue-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile Preview" className="size-9 rounded-full object-cover ring-2 ring-[#0A3B7B] shadow-xs" />
                  ) : (
                    <div className="size-9 rounded-full bg-[#0A3B7B]/10 text-[#0A3B7B] flex items-center justify-center shrink-0 border border-[#0A3B7B]/20">
                      <Camera className="size-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs sm:text-[13px] font-extrabold text-[#0A3B7B]">
                      {role === "employer" || role === "admin" ? str.photoTitleOwner : str.photoTitleWorker}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">
                      {profilePhoto ? str.photoAttached : str.photoSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#0A3B7B] text-white text-xs sm:text-[13px] font-black cursor-pointer hover:bg-[#072B5B] transition-colors shadow-xs flex items-center justify-center gap-1.5">
                    <Upload className="size-3.5" /> {profilePhoto ? str.changePhoto : str.uploadPhoto}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-700 text-white text-xs sm:text-[13px] font-black hover:bg-emerald-800 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="size-3.5" /> {str.takePhoto}
                  </button>
                </div>
              </div>

              {/* 5. E-mail Field */}
              <div>
                <Label htmlFor="reg-email" className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
                  {str.emailLabel}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="off"
                    placeholder={str.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                  />
                </div>
              </div>

              {/* 6. Phone Number & Send OTP */}
              <div>
                <Label htmlFor="reg-phone" className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
                  {str.phoneLabel}
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      maxLength={10}
                      autoComplete="off"
                      placeholder={str.phonePlaceholder}
                      value={role === "admin" || role === "employer" ? employerPhone : workerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setWorkerPhone(val);
                        setEmployerPhone(val);
                      }}
                      className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={isResending}
                    onClick={() => {
                      const p = role === "admin" || role === "employer" ? employerPhone : workerPhone;
                      sendOtpToMobile(p);
                    }}
                    className="px-3 h-9.5 rounded-lg bg-[#0A3B7B] hover:bg-[#072B5B] text-white text-xs font-black shrink-0 shadow-xs cursor-pointer transition-colors"
                  >
                    {showOtpField ? str.resendOtp : str.sendOtp}
                  </button>
                </div>
              </div>

              {/* 7. O.T.P Field (when sent) */}
              {showOtpField && (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="otp" className="text-xs sm:text-[13px] font-extrabold text-emerald-800 block">
                      {str.otpLabel}
                    </Label>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isResending}
                      onClick={handleResendOtp}
                      className={`text-[11px] sm:text-xs font-black transition-all flex items-center gap-1.5 px-2 py-0.5 rounded-md ${resendCooldown > 0
                        ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "text-[#0A3B7B] bg-blue-50 hover:bg-blue-100 cursor-pointer shadow-2xs"
                        }`}
                      title="Resend OTP"
                    >
                      <RotateCcw className={`size-3 ${isResending ? "animate-spin" : ""}`} />
                      <span>{resendCooldown > 0 ? `${str.resendOtp} (${resendCooldown}s)` : str.resendOtp}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Eye className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-600" />
                    <input
                      id="otp"
                      type="text"
                      required
                      placeholder={str.otpPlaceholder}
                      maxLength={6}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-emerald-300 text-sm font-bold tracking-widest text-emerald-900 placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1.5 text-xs">
                    <p className="text-emerald-600 font-semibold">
                      {str.otpSentSuccess}
                    </p>
                    {resendCooldown === 0 && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#0A3B7B] font-extrabold hover:underline cursor-pointer"
                      >
                        {str.resendOtp}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Password toggle */}
              <div className="pt-0.5">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>{str.passwordOptionalHint}</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomPassword(!showCustomPassword)}
                    className="text-[#0A3B7B] font-bold hover:underline cursor-pointer"
                  >
                    {showCustomPassword ? str.hideCustomPassword : str.setCustomPassword}
                  </button>
                </div>
                {showCustomPassword && (
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={str.customPasswordPlaceholder}
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-9.5 pl-9 pr-9 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* REGISTER SUBMIT BUTTON */}
              <Button
                disabled={busy}
                type="submit"
                className="w-full h-11 bg-[#0A3B7B] hover:bg-[#072B5B] text-white font-black text-sm sm:text-[15px] rounded-xl shadow-md shadow-[#0A3B7B]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                {busy ? (
                  <Loader2 className="animate-spin size-4" />
                ) : showOtpField ? (
                  <>
                    <Check className="size-4" /> {str.verifyAndRegisterBtn}
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" /> {str.registerBtn}
                  </>
                )}
              </Button>
            </>
          )}

          {/* ============================================================ */}
          {/* LOGIN / FORGOT FORM FIELDS (UNCHANGED ORIGINAL REAL JOB)     */}
          {/* ============================================================ */}
          {mode !== "register" && (
            <>
              <div>
                <Label htmlFor="email" className="text-xs sm:text-[13px] font-extrabold text-gray-800 mb-1 block">
                  {role === "employee"
                    ? str.employeeMobileLabel
                    : str.loginEmailLabel}
                </Label>
                <div className="relative">
                  {/^\d+$/.test(email.replace(/\D/g, "")) && email.length >= 5 ? (
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#0A3B7B]" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  )}
                  <input
                    id="email"
                    type="text"
                    required
                    autoComplete="off"
                    placeholder={role === "employee" ? str.employeeMobilePlaceholder : str.loginEmailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9.5 pl-9 pr-3 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="password" className="text-xs sm:text-[13px] font-extrabold text-gray-800">
                      {role === "employee" ? str.employeePinLabel : str.passwordLabel}
                    </Label>
                    {role !== "employee" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs sm:text-[13px] font-bold text-[#0A3B7B] hover:underline cursor-pointer"
                      >
                        {str.forgotPasswordLink}
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder={role === "employee" ? str.employeePinPlaceholder : str.passwordPlaceholder}
                      minLength={4}
                      maxLength={role === "employee" ? 4 : undefined}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-9.5 pl-9 pr-9 bg-white rounded-lg border border-gray-200 text-xs sm:text-[13px] font-bold text-gray-900 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A3B7B] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* REMEMBER ME CHECKBOX */}
              {mode === "login" && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-[#0A3B7B] focus:ring-[#0A3B7B] accent-[#0A3B7B] cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-xs sm:text-[13px] font-bold text-gray-700 cursor-pointer select-none">
                    {str.rememberMe}
                  </label>
                </div>
              )}

              {/* LOGIN SUBMIT BUTTON */}
              <Button
                disabled={busy}
                type="submit"
                className="w-full h-11 bg-[#0A3B7B] hover:bg-[#072B5B] text-white font-black text-sm sm:text-[15px] rounded-xl shadow-md shadow-[#0A3B7B]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                {busy ? (
                  <Loader2 className="animate-spin size-4" />
                ) : mode === "forgot" ? (
                  str.sendResetLink
                ) : (
                  <>
                    <LogIn className="size-4" /> {str.signInBtn}
                  </>
                )}
              </Button>
            </>
          )}
        </form>

        {/* BOTTOM REGISTER / LOGIN SWITCH */}
        {role !== "employee" && (
          <div className="mt-3 text-center text-xs sm:text-[13px] font-bold text-gray-600">
            {mode === "register" ? str.alreadyHaveAccount : str.dontHaveAccount}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "register" ? "login" : "register")}
              className="text-[#0A3B7B] font-black hover:underline ml-1 cursor-pointer"
            >
              {mode === "register" ? str.signInLink : str.registerLink}
            </button>
          </div>
        )}
      </div>

      {/* Live WebCam Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-[#051B38]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-white/40 flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#0A3B7B]/10 text-[#0A3B7B] flex items-center justify-center">
                  <Camera className="size-4" />
                </div>
                <span className="font-black text-sm text-[#0A3B7B]">
                  {str.cameraTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Video Stream or Captured Preview */}
            <div className="relative size-64 sm:size-72 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner border-2 border-[#0A3B7B]">
              {tempCaptured ? (
                <img src={tempCaptured} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center justify-center gap-3 mt-5">
              {tempCaptured ? (
                <>
                  <button
                    type="button"
                    onClick={() => setTempCaptured(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="size-4" /> {str.retakePhoto}
                  </button>
                  <button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="size-4" /> {str.usePhoto}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-3 rounded-full bg-[#0A3B7B] hover:bg-[#072B5B] text-white text-xs font-black shadow-lg shadow-[#0A3B7B]/30 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <Camera className="size-4" /> 📷 {str.snapPhoto}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
