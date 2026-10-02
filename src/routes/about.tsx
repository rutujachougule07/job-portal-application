import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  HardHat,
  HeartHandshake,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { PublicHeader } from "@/components/portal/PublicHeader";
import { PublicFooter } from "@/components/portal/PublicFooter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — REAL JOB | Find Work | Find Workers" },
      { name: "description", content: "Learn about REAL JOB — India's trusted digital workforce & recruitment platform connecting verified workers with top employers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, n } = useI18n();

  return (
    <>
      <PublicHeader />
      <main className="bg-[#F5F8FC] min-h-screen">
        {/* Banner Section */}
        <section className="bg-[#063B78] text-white py-20 sm:py-32 relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#125BB5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFC400] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#FFC400] backdrop-blur-md mb-6 shadow-lg">
                <Sparkles className="size-4" />
                {t("aboutHeroEyebrow")}
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white pb-2">
                {t("heroTitleLine1")} {t("heroTitleLine2")} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC400] to-yellow-200">{t("heroTitleLine3")}</span>
              </h1>

              <p className="mt-8 text-lg sm:text-2xl font-medium text-white/90 leading-relaxed max-w-3xl mx-auto">
                {t("aboutHeroSub")}
              </p>
            </div>
          </div>
        </section>

        {/* Core Stats Bar */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white rounded-3xl shadow-2xl border border-[#DCE5F0] overflow-hidden">
            <div className="text-center p-8 border-b md:border-b-0 border-r border-[#DCE5F0] hover:bg-blue-50 transition-colors duration-300">
              <span className="text-4xl sm:text-5xl font-black text-[#063B78]">{n("50,000+")}</span>
              <span className="block text-sm font-bold text-[#5B6B7F] mt-2 uppercase tracking-wide">{t("statWorkers")}</span>
            </div>
            <div className="text-center p-8 border-b md:border-b-0 md:border-r border-[#DCE5F0] hover:bg-blue-50 transition-colors duration-300">
              <span className="text-4xl sm:text-5xl font-black text-[#125BB5]">{n("10,000+")}</span>
              <span className="block text-sm font-bold text-[#5B6B7F] mt-2 uppercase tracking-wide">{t("statEmployers")}</span>
            </div>
            <div className="text-center p-8 border-r border-[#DCE5F0] hover:bg-blue-50 transition-colors duration-300">
              <span className="text-4xl sm:text-5xl font-black text-[#063B78]">{n("1,50,000+")}</span>
              <span className="block text-sm font-bold text-[#5B6B7F] mt-2 uppercase tracking-wide">{t("statJobs")}</span>
            </div>
            <div className="text-center p-8 hover:bg-yellow-50 transition-colors duration-300">
              <span className="text-4xl sm:text-5xl font-black text-[#082F63] px-3 py-1 rounded-lg bg-[#FFC400] inline-block shadow-md">{n("100%")}</span>
              <span className="block text-sm font-bold text-[#5B6B7F] mt-2 uppercase tracking-wide">{t("statContact")}</span>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10 items-stretch">
              <div className="group bg-white rounded-3xl p-10 shadow-lg border border-[#DCE5F0] hover:shadow-2xl hover:border-[#125BB5]/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="z-10">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-[#063B78] to-[#125BB5] text-white flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="size-8" />
                  </div>
                  <h2 className="text-3xl font-black text-[#10233F] tracking-tight">{t("ourMission")}</h2>
                  <p className="mt-5 text-base font-medium text-[#5B6B7F] leading-relaxed">
                    {t("ourMissionDesc")}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#DCE5F0] flex items-center gap-3 text-sm font-bold text-[#063B78] z-10">
                  <div className="bg-[#FFC400]/20 p-1 rounded-full"><CheckCircle2 className="size-5 text-[#FFC400]" /></div>
                  {t("trustCommission")} • {t("trustPhone")}
                </div>
              </div>

              <div className="group bg-white rounded-3xl p-10 shadow-lg border border-[#DCE5F0] hover:shadow-2xl hover:border-[#FFC400]/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="z-10">
                  <div className="size-16 rounded-2xl bg-gradient-to-br from-[#FFC400] to-yellow-500 text-[#082F63] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Globe className="size-8" />
                  </div>
                  <h2 className="text-3xl font-black text-[#10233F] tracking-tight">{t("ourVision")}</h2>
                  <p className="mt-5 text-base font-medium text-[#5B6B7F] leading-relaxed">
                    {t("ourVisionDesc")}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[#DCE5F0] flex items-center gap-3 text-sm font-bold text-[#125BB5] z-10">
                  <div className="bg-[#FFC400]/20 p-1 rounded-full"><CheckCircle2 className="size-5 text-[#FFC400]" /></div>
                  {t("trustVerified")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How REAL JOB Works */}
        <section className="py-20 sm:py-32 bg-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-black uppercase tracking-widest text-[#125BB5] bg-[#EBF1F8] px-4 py-1.5 rounded-full shadow-sm">
                {t("howWorksSimple")}
              </span>
              <h2 className="mt-6 text-4xl font-black text-[#10233F] sm:text-5xl tracking-tight">
                {t("howWorks")}
              </h2>
              <p className="mt-4 text-lg font-medium text-[#5B6B7F]">
                {t("howWorksSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              {/* For Workers */}
              <div className="bg-gradient-to-b from-[#F5F8FC] to-white p-10 rounded-[2rem] border border-[#DCE5F0] shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-5 mb-10">
                  <div className="size-14 rounded-2xl bg-[#FFC400] text-[#082F63] flex items-center justify-center font-black shadow-md">
                    <HardHat className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#10233F]">{t("forWorkersTitle")}</h3>
                    <span className="text-sm font-bold text-[#125BB5]">{t("seekerDesc")}</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group flex gap-5">
                    <span className="size-12 rounded-2xl bg-white border-2 border-[#063B78] text-[#063B78] font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#063B78] group-hover:text-white transition-colors duration-300">{n(1)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-lg">{t("forWorkersStep1Title")}</h4>
                      <p className="text-sm text-[#5B6B7F] mt-2 font-medium">{t("forWorkersStep1Desc")}</p>
                    </div>
                  </div>
                  <div className="group flex gap-5">
                    <span className="size-12 rounded-2xl bg-white border-2 border-[#063B78] text-[#063B78] font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#063B78] group-hover:text-white transition-colors duration-300">{n(2)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-lg">{t("forWorkersStep2Title")}</h4>
                      <p className="text-sm text-[#5B6B7F] mt-2 font-medium">{t("forWorkersStep2Desc")}</p>
                    </div>
                  </div>
                  <div className="group flex gap-5">
                    <span className="size-12 rounded-2xl bg-white border-2 border-[#063B78] text-[#063B78] font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#063B78] group-hover:text-white transition-colors duration-300">{n(3)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-lg">{t("forWorkersStep3Title")}</h4>
                      <p className="text-sm text-[#5B6B7F] mt-2 font-medium">{t("forWorkersStep3Desc")}</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-12 bg-[#FFC400] hover:bg-[#e6b000] text-[#10233F] font-extrabold text-base py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <Link to="/jobs">{t("jobs")}</Link>
                </Button>
              </div>

              {/* For Employers */}
              <div className="bg-gradient-to-b from-[#F5F8FC] to-white p-10 rounded-[2rem] border border-[#DCE5F0] shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-5 mb-10">
                  <div className="size-14 rounded-2xl bg-[#063B78] text-white flex items-center justify-center font-black shadow-md">
                    <Building2 className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#10233F]">{t("forEmployersTitle")}</h3>
                    <span className="text-sm font-bold text-[#125BB5]">{t("employerDesc")}</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group flex gap-5">
                    <span className="size-12 rounded-2xl bg-white border-2 border-[#125BB5] text-[#125BB5] font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#125BB5] group-hover:text-white transition-colors duration-300">{n(1)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-lg">{t("forEmployersStep1Title")}</h4>
                      <p className="text-sm text-[#5B6B7F] mt-2 font-medium">{t("forEmployersStep1Desc")}</p>
                    </div>
                  </div>
                  <div className="group flex gap-5">
                    <span className="size-12 rounded-2xl bg-white border-2 border-[#125BB5] text-[#125BB5] font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#125BB5] group-hover:text-white transition-colors duration-300">{n(2)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-lg">{t("forEmployersStep2Title")}</h4>
                      <p className="text-sm text-[#5B6B7F] mt-2 font-medium">{t("forEmployersStep2Desc")}</p>
                    </div>
                  </div>
                  <div className="group flex gap-5">
                    <span className="size-12 rounded-2xl bg-white border-2 border-[#125BB5] text-[#125BB5] font-black text-lg flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#125BB5] group-hover:text-white transition-colors duration-300">{n(3)}</span>
                    <div>
                      <h4 className="font-extrabold text-[#10233F] text-lg">{t("forEmployersStep3Title")}</h4>
                      <p className="text-sm text-[#5B6B7F] mt-2 font-medium">{t("forEmployersStep3Desc")}</p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-12 bg-[#063B78] hover:bg-[#10233F] text-white font-extrabold text-base py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <Link to="/workers">{t("workers")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 sm:py-32 bg-[#F5F8FC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-black text-[#10233F] sm:text-5xl tracking-tight">
                {t("whyChooseTitle")}
              </h2>
              <p className="mt-5 text-lg font-medium text-[#5B6B7F]">
                {t("whyUsSubtitle")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white rounded-3xl p-8 text-center border border-[#DCE5F0] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer">
                <div className="size-16 rounded-2xl bg-[#063B78]/10 text-[#063B78] mx-auto flex items-center justify-center mb-6 group-hover:bg-[#063B78] group-hover:text-white transition-colors duration-300">
                  <ShieldCheck className="size-8" />
                </div>
                <h3 className="font-black text-xl text-[#10233F] mb-3">{t("verifiedUsersTitle")}</h3>
                <p className="text-sm font-medium text-[#5B6B7F] leading-relaxed">
                  {t("verifiedUsersDesc")}
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 text-center border border-[#DCE5F0] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer">
                <div className="size-16 rounded-2xl bg-[#FFC400]/20 text-[#082F63] mx-auto flex items-center justify-center mb-6 group-hover:bg-[#FFC400] group-hover:text-[#082F63] transition-colors duration-300">
                  <HeartHandshake className="size-8" />
                </div>
                <h3 className="font-black text-xl text-[#10233F] mb-3">{t("zeroFeesTitle")}</h3>
                <p className="text-sm font-medium text-[#5B6B7F] leading-relaxed">
                  {t("zeroFeesDesc")}
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 text-center border border-[#DCE5F0] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer">
                <div className="size-16 rounded-2xl bg-[#125BB5]/10 text-[#125BB5] mx-auto flex items-center justify-center mb-6 group-hover:bg-[#125BB5] group-hover:text-white transition-colors duration-300">
                  <Globe className="size-8" />
                </div>
                <h3 className="font-black text-xl text-[#10233F] mb-3">{t("regionalLangTitle")}</h3>
                <p className="text-sm font-medium text-[#5B6B7F] leading-relaxed">
                  {t("regionalLangDesc")}
                </p>
              </div>

              <div className="group bg-white rounded-3xl p-8 text-center border border-[#DCE5F0] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer">
                <div className="size-16 rounded-2xl bg-[#063B78]/10 text-[#063B78] mx-auto flex items-center justify-center mb-6 group-hover:bg-[#063B78] group-hover:text-white transition-colors duration-300">
                  <Zap className="size-8" />
                </div>
                <h3 className="font-black text-xl text-[#10233F] mb-3">{t("instantHiringTitle")}</h3>
                <p className="text-sm font-medium text-[#5B6B7F] leading-relaxed">
                  {t("instantHiringDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
