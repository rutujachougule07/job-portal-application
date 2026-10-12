import React from 'react';
import { Download } from 'lucide-react';
// Make sure to install html2pdf.js using: npm install html2pdf.js
// import html2pdf from 'html2pdf.js';

interface SalarySlipProps {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeId: string;
  designation: string;
  month: string;
  year: string;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
}

const SalarySlip: React.FC<SalarySlipProps> = ({
  companyName,
  companyAddress,
  employeeName,
  employeeId,
  designation,
  month,
  year,
  basicSalary,
  hra,
  conveyance,
  medicalAllowance,
  specialAllowance,
  providentFund,
  professionalTax,
  incomeTax,
}) => {
  const totalEarnings = basicSalary + hra + conveyance + medicalAllowance + specialAllowance;
  const totalDeductions = providentFund + professionalTax + incomeTax;
  const netPay = totalEarnings - totalDeductions;

  const handleDownload = () => {
    const element = document.getElementById('salary-slip-content');
    if (element) {
      const opt = {
        margin:       1,
        filename:     `Salary_Slip_${employeeName}_${month}_${year}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' as const }
      };
      
      // Dynamic import to avoid SSR issues if used in frameworks like Next.js/Remix
      import('html2pdf.js').then((html2pdf) => {
        html2pdf.default().set(opt).from(element).save();
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      <div id="salary-slip-content" className="bg-white p-8 border border-gray-200 shadow-sm rounded-lg">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 uppercase">{companyName}</h1>
          <p className="text-sm text-gray-500 mt-1">{companyAddress}</p>
          <h2 className="text-xl font-semibold mt-4 text-gray-700">Salary Slip for {month} {year}</h2>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <span className="font-semibold text-gray-600">Employee Name</span>
              <span className="col-span-2 text-gray-800">: {employeeName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <span className="font-semibold text-gray-600">Employee ID</span>
              <span className="col-span-2 text-gray-800">: {employeeId}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-gray-600">Designation</span>
              <span className="col-span-2 text-gray-800">: {designation}</span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <span className="font-semibold text-gray-600">Bank Name</span>
              <span className="col-span-2 text-gray-800">: HDFC Bank</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <span className="font-semibold text-gray-600">Account No.</span>
              <span className="col-span-2 text-gray-800">: XXXX-XXXX-1234</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-gray-600">UAN No.</span>
              <span className="col-span-2 text-gray-800">: 123456789012</span>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="border border-gray-300 rounded-md overflow-hidden mb-6">
          <div className="grid grid-cols-2 bg-gray-100 font-bold border-b border-gray-300">
            <div className="p-3 border-r border-gray-300">Earnings</div>
            <div className="p-3">Deductions</div>
          </div>
          
          <div className="grid grid-cols-2">
            {/* Earnings Column */}
            <div className="border-r border-gray-300">
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>Basic Salary</span>
                <span>₹{basicSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>House Rent Allowance (HRA)</span>
                <span>₹{hra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>Conveyance</span>
                <span>₹{conveyance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>Medical Allowance</span>
                <span>₹{medicalAllowance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 h-[49px]">
                <span>Special Allowance</span>
                <span>₹{specialAllowance.toFixed(2)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>Provident Fund (PF)</span>
                <span>₹{providentFund.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>Professional Tax</span>
                <span>₹{professionalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span>Income Tax (TDS)</span>
                <span>₹{incomeTax.toFixed(2)}</span>
              </div>
              <div className="p-3 border-b border-gray-200 h-[49px]"></div>
              <div className="p-3 h-[49px]"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 bg-gray-100 font-bold border-t border-gray-300">
            <div className="flex justify-between p-3 border-r border-gray-300">
              <span>Total Earnings</span>
              <span>₹{totalEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3">
              <span>Total Deductions</span>
              <span>₹{totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="flex justify-between items-center bg-blue-50 p-4 border border-blue-200 rounded-md mb-8">
          <span className="font-bold text-lg text-blue-900">Net Pay</span>
          <span className="font-bold text-xl text-blue-900">₹{netPay.toFixed(2)}</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-16 pt-8 border-t border-gray-200 text-sm font-semibold">
          <div className="text-center">
            <div className="w-32 border-b-2 border-gray-800 mb-2"></div>
            Employer Signature
          </div>
          <div className="text-center">
            <div className="w-32 border-b-2 border-gray-800 mb-2"></div>
            Employee Signature
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          This is a computer-generated document. No signature is required if sent digitally.
        </p>
      </div>
    </div>
  );
};

export default SalarySlip;
