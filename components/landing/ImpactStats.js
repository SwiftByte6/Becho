'use client';

import Image from 'next/image';
import { Trash2, Leaf, Recycle, Building2 } from 'lucide-react';

const iconMap = { Trash2, Leaf, Recycle, Building2 };

const stats = [
  {
    label: 'Waste Diverted from Landfill',
    value: '12,400',
    unit: 'kg',
    icon: 'Trash2',
    suffix: '+',
    positionClass: 'left-[35%] top-2 sm:left-6 md:left-8 lg:left-[20%] lg:top-10',
  },
  {
    label: 'CO₂ Saved',
    value: '28.6',
    unit: 'tons',
    icon: 'Leaf',
    suffix: '',
    positionClass: 'right-[10%] top-12 sm:right-6 md:right-8 lg:right-[20%] lg:top-16',
  },
  {
    label: 'Materials Reused',
    value: '7,830',
    unit: 'kg',
    icon: 'Recycle',
    suffix: '+',
    positionClass: 'left-4 top-[25rem] sm:left-10 md:left-12 lg:left-0 lg:top-[21rem]',
  },
  {
    label: 'Active Companies',
    value: '142',
    unit: '',
    icon: 'Building2',
    suffix: '+',
    positionClass: 'right-3 top-[33rem] sm:right-10 md:right-12 lg:right-0 lg:top-[19rem]',
  },
];

export default function ImpactStats() {
  return (
    <section className="bg-transparent px-6 py-24 h-screen">
      <div className="mx-auto max-w-6xl px-2 sm:px-4">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded-full border border-green-200 bg-[#f4f7ee] px-4 py-1.5 text-xs font-semibold text-green-700">
            Real Impact
          </span>
          <h2 className="mb-3 text-4xl font-extrabold tracking-tight text-heading">
            Environmental Impact
          </h2>
          <p className="mx-auto max-w-lg text-lg text-[#7a6b5f]">
            Every material reused on Becho contributes to a healthier planet.
          </p>
        </div>

        <div className="relative mx-auto min-h-[54rem] max-w-6xl md:min-h-[38rem] lg:min-h-[44rem]">
          <div className="absolute left-1/2 md:bottom-[20%] lg:bottom-[10%] z-10 -translate-x-1/2 ">
            <Image
              src="/LandingPage/Impact.png"
              alt="Environmental impact illustration"
              width={920}
              height={960}
              className="h-auto w-[420px] max-w-none object-contain sm:w-[520px] md:w-[520px] lg:w-[860px]"
              priority
            />
          </div>

          {stats.map(({ label, value, unit, icon, suffix, positionClass }) => {
            const Icon = iconMap[icon];
            return (
              <div
                key={label}
                className={`absolute z-20 w-[180px] rounded-[26px] border border-[#e5dccd] bg-[#fffaf2]/95 p-5 text-center shadow-[0_26px_50px_rgba(117,93,70,0.12)] transition-transform duration-200 hover:-translate-y-1 sm:w-[210px] lg:w-[220px] ${positionClass}`}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4e2]">
                  <Icon size={22} className="text-[#7f925b]" />
                </div>
                <div className="mb-1 text-3xl font-extrabold text-[#534438]">
                  {value}<span className="text-[#7f925b]">{suffix}</span>
                  {unit && <span className="ml-1 text-base font-semibold text-[#9a8b7d]">{unit}</span>}
                </div>
                <p className="text-xs leading-snug text-[#7a6b5f]">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
