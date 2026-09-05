import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  HiCurrencyDollar, 
  HiUsers, 
  HiCollection, 
  HiStatusOnline,
  HiTrendingUp
} from 'react-icons/hi';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const userStatus = (session.user as any)?.status;

  if (userStatus !== "staff" && userStatus !== "admin") {
    redirect("/dashboard");
  }

  const stats = [
    { name: 'Total Revenue', value: '$128,430', icon: HiCurrencyDollar, color: 'bg-emerald-500', lightColor: 'bg-emerald-50 text-emerald-600' },
    { name: 'Total Customers', value: '1,240', icon: HiUsers, color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600' },
    { name: 'Total Project', value: '86', icon: HiCollection, color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-600' },
    { name: 'Active Projects', value: '12', icon: HiStatusOnline, color: 'bg-orange-500', lightColor: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-slate-500 font-medium text-lg">Welcome back, <span className="text-primary font-bold">{session.user?.name}</span>. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">{userStatus} account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white px-[10px] py-8 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.lightColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="text-3xl" />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                  <HiTrendingUp />
                  <span>+12%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.name}</p>
                <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-[10px] py-8 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-900">Recent Activities</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <HiCollection className="text-4xl" />
            </div>
            <p className="text-slate-400 font-medium italic">No recent activities to show at the moment.</p>
          </div>
        </div>
        
        <div className="bg-primary text-white rounded-[2rem] px-[10px] py-10 md:p-10 shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold leading-tight">Need help managing your projects?</h3>
            <p className="text-white/80 font-medium">Contact our support team for any assistance or custom feature requests.</p>
            <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black transition-all hover:bg-slate-50 hover:scale-105">
              Contact Support
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -left-10 -top-10 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700 delay-100"></div>
        </div>
      </div>
    </div>
  );
}
