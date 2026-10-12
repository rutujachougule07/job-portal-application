const fs = require('fs');
let content = fs.readFileSync('src/routes/admin.tsx', 'utf8');
let lines = content.split('\n');

// The print area is from line 4918 to 5049 (0-indexed 4917 to 5048)
// Wait, I will find the exact indices
let startIndex = lines.findIndex(l => l.includes('{/* Print Area */}'));
let endIndex = -1;
for(let i=startIndex; i<lines.length; i++) {
    if(lines[i].includes('This is a computer-generated document. No signature is required.')) {
        // The div closes 2 lines after this usually
        endIndex = i + 2;
        break;
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const replaceLines = `            {/* Print Area */}
            <div className="bg-white overflow-hidden relative">
              {(() => {
                const metrics = getWorkerReportMetrics(v, viewSlipPeriod);
                return (
                  <SalarySlip 
                    companyName={currentUser?.fullName || "INFOYSHONAD TECHNOLOGY PVT LTD"}
                    companyAddress={currentUser?.location || "India"}
                    employeeName={v.name}
                    employeeId={\`EMP-\${v.id.substring(0, 6).toUpperCase()}\`}
                    designation={v.trade || "Worker"}
                    month={viewSlipPeriod === "month" ? "This Month" : "This Week"}
                    year={new Date().getFullYear().toString()}
                    basicSalary={metrics.netPay}
                    hra={0}
                    conveyance={0}
                    medicalAllowance={0}
                    specialAllowance={0}
                    providentFund={0}
                    professionalTax={0}
                    incomeTax={0}
                  />
                );
              })()}
            </div>`.split('\n');
            
    lines.splice(startIndex, endIndex - startIndex + 1, ...replaceLines);
    
    // Also remove the download button around line 4878-4884
    let btnStart = lines.findIndex(l => l.includes('<Download className="size-4 mr-2" /> Download / Print'));
    if(btnStart !== -1) {
        // go up to <Button
        let btnRealStart = btnStart;
        while(!lines[btnRealStart].includes('<Button')) {
            btnRealStart--;
        }
        // go down to </Button>
        let btnEnd = btnStart;
        while(!lines[btnEnd].includes('</Button>')) {
            btnEnd++;
        }
        lines.splice(btnRealStart, btnEnd - btnRealStart + 1, '                {/* Download button removed as SalarySlip handles its own PDF generation */}');
    }
    
    fs.writeFileSync('src/routes/admin.tsx', lines.join('\n'));
    console.log('Array splice successful');
} else {
    console.log('Could not find indices', startIndex, endIndex);
}
