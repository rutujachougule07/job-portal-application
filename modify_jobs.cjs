const fs = require('fs');

let content = fs.readFileSync('src/routes/jobs.index.tsx', 'utf-8');

// 1. Add imports
content = content.replace('import { PublicHeader } from "@/components/portal/PublicHeader";', 
`import { PublicHeader } from "@/components/portal/PublicHeader";
import { dataStore } from "@/lib/data-store";
import { UserSidebarLayout } from "@/components/portal/UserSidebarLayout";`);

// 2. Add currentUser to JobsPage
content = content.replace('const [isInitialState, setIsInitialState] = useState(true);',
`const [isInitialState, setIsInitialState] = useState(true);
  const currentUser = dataStore.getCurrentUser();`);

// 3. Replace return with `content` variable, then wrap based on currentUser
content = content.replace(/return \(\s*<>\s*<PublicHeader \/>\s*<main className="bg-\[#F5F8FC\] min-h-screen py-8">/,
`const pageContent = (
      <main className={\`bg-[#F5F8FC] min-h-screen \${currentUser ? '' : 'py-8'}\`}>`);

// Replace the `<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">` wrapper
content = content.replace(/<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">/,
`<div className={\`mx-auto \${currentUser ? 'w-full' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}\`}>`);

// Add !currentUser logic to hero banner
content = content.replace(/\{\(!categoryFilter \|\| categoryFilter === "all"\) \? \(/,
`{(!categoryFilter || categoryFilter === "all") && !currentUser ? (`);

// Hide category header if currentUser
content = content.replace(/\) : \(\s*<div className="mb-10 bg-white p-6 sm:p-8 rounded-\[2rem\] border/,
`) : (!currentUser && categoryFilter && categoryFilter !== "all" ? (
            <div className="mb-10 bg-white p-6 sm:p-8 rounded-[2rem] border`);

// Close the Category Header wrapper and add the compact search bar for currentUser
content = content.replace(/<\/div>\s*\}\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\}/,
`              </div>
            </div>
          ) : null)}

          {currentUser && (
            <div className="mb-6 w-full flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-[#DCE5F0]">
              <div className="flex-1 relative flex items-center bg-[#F5F8FC] rounded-xl h-12 overflow-hidden border border-[#DCE5F0]">
                <Search className="absolute left-4 size-5 text-[#5B6B7F]" />
                <Input
                  placeholder={t("searchJobPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-full border-0 bg-transparent text-sm text-[#10233F] font-bold focus-visible:ring-0 rounded-none shadow-none"
                />
              </div>
              <div className="md:w-[200px] relative flex items-center bg-[#F5F8FC] rounded-xl h-12 overflow-hidden border border-[#DCE5F0]">
                <MapPin className="absolute left-4 size-5 text-[#125BB5]" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full h-full border-0 bg-transparent text-sm font-bold text-[#10233F] pl-12 pr-10 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">{t("allLocations")}</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                  <option value="chakan">Chakan</option>
                  <option value="bengaluru">Bengaluru</option>
                </select>
                <ChevronDown className="absolute right-4 size-5 text-[#5B6B7F] pointer-events-none" />
              </div>
              <Button className="btn-yellow h-12 font-black text-sm px-8 rounded-xl shadow-md transition-shadow shrink-0">
                {t("search")}
              </Button>
            </div>
          )}`);

// Hide popular categories
content = content.replace(/\{\(!categoryFilter \|\| categoryFilter === "all"\) && \(/,
`{(!categoryFilter || categoryFilter === "all") && !currentUser && (`);

// Replace the end return with conditional return
content = content.replace(/<\/main>\s*<PublicFooter \/>\s*<\/>\s*\);\s*\}/,
`      </main>
  );

  if (currentUser) {
    return (
      <UserSidebarLayout activeTab="find-jobs">
        {pageContent}
      </UserSidebarLayout>
    );
  }

  return (
    <>
      <PublicHeader />
      {pageContent}
      <PublicFooter />
    </>
  );
}`);

fs.writeFileSync('src/routes/jobs.index.tsx', content);
