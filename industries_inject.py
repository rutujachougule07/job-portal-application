with open(r'src/routes/jobs.index.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find line with "              )}" after the pills section (line ~619 = index 618)
# We'll insert industry pills before the </div> </div> closing
target_idx = None
for i, line in enumerate(lines):
    if '                </div>\n' == line and i > 600 and i < 640:
        # Check previous line is "              )}" 
        if i > 0 and '              )}\n' == lines[i]:
            target_idx = i
            break
        # check if line i-1 is "                  )}\n"
        if i > 0 and '                  )}\n' == lines[i-1]:
            target_idx = i
            break

# Let's just find the exact spot by index
# Line 619 (0-indexed 618) is "                </div>\n"
# Line 620 (0-indexed 619) is "              )}\n"
# We insert BEFORE line 619 (0-indexed 618)

INDUSTRY_PILLS = """
                  {/* Industry (Factory Type) pills - only for Manufacturing */}
                  {categoryFilter === "manufacturing" && (
                    <div className="mt-5">
                      <p className="text-[10px] font-black uppercase text-[#5B6B7F] tracking-wider mb-3">
                        \U0001f3ed \u0915\u093e\u0930\u0916\u093e\u0928\u094d\u092f\u093e\u091a\u093e \u092a\u094d\u0930\u0915\u093e\u0930 (Factory Type) \u0928\u093f\u0935\u0921\u093e:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setIndustryFilter("all")}
                          className={`px-4 py-2 rounded-full text-[11px] font-black tracking-wide transition-all shadow-sm ${
                            industryFilter === "all"
                              ? "bg-[#FFC400] text-[#082F63] shadow-md scale-105"
                              : "bg-white border border-[#DCE5F0] text-[#5B6B7F] hover:bg-[#FFC400]/10 hover:text-[#082F63] hover:scale-105"
                          }`}
                        >
                          \U0001f3ed \u0938\u0930\u094d\u0935 \u0915\u093e\u0930\u0916\u093e\u0928\u0947
                        </button>
                        {MANUFACTURING_INDUSTRIES.map(ind => (
                          <button
                            key={ind.id}
                            onClick={() => setIndustryFilter(ind.id)}
                            className={`px-4 py-2 rounded-full text-[11px] font-black tracking-wide transition-all shadow-sm ${
                              industryFilter === ind.id
                                ? "bg-[#FFC400] text-[#082F63] shadow-md scale-105"
                                : "bg-white border border-[#DCE5F0] text-[#5B6B7F] hover:bg-[#FFC400]/10 hover:text-[#082F63] hover:scale-105"
                            }`}
                          >
                            {ind.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
"""

# Find the index of "                </div>\n" that follows "                  )}\n"
insert_at = None
for i in range(len(lines)):
    if lines[i] == '                  )}\n' and i+1 < len(lines) and lines[i+1] == '                </div>\n':
        insert_at = i + 1  # Insert before </div>
        break

if insert_at is None:
    print("Target not found! Searching for nearby lines:")
    for i, l in enumerate(lines[610:630], start=611):
        print(f"  {i}: {repr(l)}")
else:
    print(f"Inserting industry pills at line index {insert_at} (line {insert_at+1})")
    lines.insert(insert_at, INDUSTRY_PILLS)
    with open(r'src/routes/jobs.index.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("SUCCESS!")
