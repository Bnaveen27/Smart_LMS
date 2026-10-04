import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, Check, Zap, Sparkles, Shield, Building2, 
  Users, HardDrive, Globe, Award, ArrowUpRight
} from 'lucide-react';

export const SubscriptionsTab = () => {
  const { subscriptions, tenants } = useApp();
  const [billingCycle, setBillingCycle] = useState('Monthly');

  const plans = [
    {
      name: 'Starter Academy',
      tagline: 'Ideal for independent creators and single educators',
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        'Up to 1,000 active learners',
        '15 Published courses',
        '100 GB Cloud HD Video storage',
        'Standard White-label subdomain',
        'Stripe & Razorpay payment gateway',
        'Email customer support'
      ],
      color: 'border-slate-200',
      popular: false
    },
    {
      name: 'Professional Tier',
      tagline: 'For growing institutes & enterprise academies',
      monthlyPrice: 299,
      annualPrice: 249,
      features: [
        'Up to 10,000 active learners',
        'Unlimited published courses',
        '1 TB Cloud storage + CDN streaming',
        'Custom domain with automatic SSL (CNAME)',
        'Custom brand styling & CSS tokens',
        'Automated Course Certificates engine',
        'Dedicated account manager'
      ],
      color: 'border-indigo-500 ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10',
      popular: true
    },
    {
      name: 'Enterprise Corporate',
      tagline: 'Full B2B workforce training with compliance & SSO',
      monthlyPrice: 999,
      annualPrice: 849,
      features: [
        'Unlimited employees & departments',
        'SAML 2.0 / Okta / Azure AD SSO',
        'Mandatory Corporate Compliance tracking',
        'Automated Department Progress Reports',
        'SOC2 & ISO27001 Data Isolation SLA',
        '5 TB Dedicated video storage',
        '24/7 Priority engineering hotline'
      ],
      color: 'border-sky-500',
      popular: false
    }
  ];

  return (
    <div className="space-y-8">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Subscriptions & SaaS Tiers</h2>
            <span className="px-2.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold rounded-full">
              MRR: ₹2,80,000
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage multi-tenant subscription tiers, billing cycles, feature entitlements, and active tenant plan assignments.
          </p>
        </div>

        {}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setBillingCycle('Monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              billingCycle === 'Monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('Annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              billingCycle === 'Annual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Annual Billing <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-black">20% OFF</span>
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => {
          const price = billingCycle === 'Annual' ? p.annualPrice : p.monthlyPrice;

          return (
            <div 
              key={idx}
              className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative border ${p.color}`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular Tier
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{p.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">₹{price}</span>
                  <span className="text-xs font-bold text-slate-400">/ tenant / month</span>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Features Included:</span>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => alert(`Selected ${p.name} upgrade flow!`)}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition-all ${
                    p.popular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Configure Plan Settings
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Active Tenant Subscriptions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Organization / Tenant</th>
                <th className="py-3 px-4">Current Plan</th>
                <th className="py-3 px-4">Billing Rate</th>
                <th className="py-3 px-4">Renewal Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{sub.tenant_name}</td>
                  <td className="py-3 px-4 font-semibold text-indigo-600">{sub.plan} Tier</td>
                  <td className="py-3 px-4 font-bold">₹{sub.price} / {sub.billing_cycle}</td>
                  <td className="py-3 px-4 text-slate-500">{sub.renews_at}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => alert(`Manage subscription for ${sub.tenant_name}`)}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Manage Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
