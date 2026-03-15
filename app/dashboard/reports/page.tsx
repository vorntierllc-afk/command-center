'use client'

const REPORTS = [
  { week: 'Week of Mar 10', date: 'Mar 10 – Mar 16, 2026', disputes: 4, saves: 2, highlight: true },
  { week: 'Week of Mar 3', date: 'Mar 3 – Mar 9, 2026', disputes: 7, saves: 5, highlight: false },
  { week: 'Week of Feb 24', date: 'Feb 24 – Mar 2, 2026', disputes: 3, saves: 3, highlight: false },
  { week: 'Week of Feb 17', date: 'Feb 17 – Feb 23, 2026', disputes: 9, saves: 6, highlight: false },
]

export default function ReportsPage() {
  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mb-6">Reports</h1>
      {REPORTS.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg mb-2">Your first report generates after 7 days of monitoring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REPORTS.map(r => (
            <div key={r.week} className={`bg-white dark:bg-[#111111] rounded-2xl p-6 border ${r.highlight ? 'border-[#0A0A0A]' : 'border-[#F3F4F6]'}`}>
              {r.highlight && <span className="text-xs font-semibold text-[#0A0A0A] dark:text-white bg-gray-100 dark:bg-[#222222] px-2 py-0.5 rounded-full mb-3 inline-block">Latest</span>}
              <h3 className="font-semibold text-[#0A0A0A] dark:text-white mb-1">{r.week}</h3>
              <p className="text-xs text-gray-400 mb-4">{r.date}</p>
              <div className="flex gap-4 mb-4">
                <div>
                  <p className="text-2xl font-bold text-[#DC2626]">{r.disputes}</p>
                  <p className="text-xs text-gray-400">Disputes caught</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#16A34A]">{r.saves}</p>
                  <p className="text-xs text-gray-400">Saves</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-[#0A0A0A] dark:text-white border border-[#E5E7EB] dark:border-[#333333] px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition">
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
