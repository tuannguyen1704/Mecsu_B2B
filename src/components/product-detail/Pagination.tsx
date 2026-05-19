import React from 'react';
import { ChevronDown } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 font-sans">
      <button 
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 border border-slate-200 rounded text-[14px] font-bold transition-colors ${
          currentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-white' : 'text-[#005da4] hover:bg-slate-50'
        }`}
      >
        First
      </button>
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-4 py-2 border border-slate-200 rounded text-[14px] font-bold transition-colors ${
          currentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-white' : 'text-[#005da4] hover:bg-slate-50'
        }`}
      >
        Previous
      </button>

      <div className="flex items-center gap-2 mx-4">
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-slate-300 rounded px-4 pr-10 py-2 text-[15px] font-medium focus:outline-none focus:border-blue-500 cursor-pointer min-w-[70px]"
            value={currentPage}
            onChange={(e) => onPageChange(parseInt(e.target.value))}
          >
            {Array.from({ length: Math.min(20, totalPages) }).map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
            {totalPages > 20 && currentPage > 20 && (
               <option value={currentPage}>{currentPage}</option>
            )}
          </select>
          <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
        <span className="text-[15px] text-slate-700">of {totalPages} pages</span>
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border border-[#005da4] hover:bg-slate-50 rounded text-[14px] font-bold text-[#005da4] transition-colors bg-white ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Next
      </button>
      <button 
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 border border-[#005da4] hover:bg-slate-50 rounded text-[14px] font-bold text-[#005da4] transition-colors bg-white ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Last
      </button>
    </div>
  );
}
