'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ScrollText,
  Users,
  CalendarRange,
  Clock,
  Trophy,
  ClipboardCheck,
  BookOpen,
  Target,
  ShieldCheck,
} from 'lucide-react';
import PageShell from '@/components/common/PageShell';
import {
  FSSP_TITLE,
  NP_STAGE,
  NP_PLAN_HOURS,
  NP_PLAN_TOTALS,
  NP_NORMS,
  NP_THEORY,
  NP_REQUIREMENTS,
  NP_STAGE_GOALS,
} from '@/lib/fssp';

export default function FsspPage() {
  return (
    <PageShell>
      <Link href="/" className="btn-ghost -ml-2 mb-4 no-underline inline-flex">
        <ArrowLeft className="w-4 h-4" /> К плану
      </Link>

      <div className="mb-6">
        <h1 className="page-title mb-1">Этап начальной подготовки</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
          <ScrollText className="w-4 h-4 shrink-0 mt-0.5" />
          {FSSP_TITLE}. Дисциплина: {NP_STAGE.discipline}.
        </p>
      </div>

      {/* Параметры этапа */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          [CalendarRange, `${NP_STAGE.durationYears} года`, 'срок этапа'],
          [Users, `с ${NP_STAGE.minAge} лет`, 'возраст зачисления'],
          [Users, `до ${NP_STAGE.groupSize} чел.`, 'наполняемость группы'],
          [Clock, `до ${NP_STAGE.maxSessionHours} ч`, 'длительность занятия'],
          [CalendarRange, `${NP_STAGE.weeksPerYear} недели`, 'учебный год'],
          [Trophy, '1 в год', 'контрольные соревнования'],
        ].map(([Icon, value, label]: any) => (
          <div key={label} className="card p-4">
            <Icon className="w-5 h-5 text-ocean-500 mb-2" />
            <div className="font-extrabold text-slate-900 dark:text-white leading-tight">
              {value}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Нагрузка по годам */}
      <h2 className="section-title mb-3">Объём нагрузки по годам</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="card p-5 border-brand-200 dark:border-brand-800">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
            1-й год (до года) — наш план готов
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {NP_STAGE.year1.hoursPerWeek} ч/нед
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {NP_STAGE.year1.hoursPerYear} ч в год. Наш план: 3 занятия × 90 минут = 4,5 ч/нед,
            234 ч/год — 52 недели, 156 тренировок.
          </p>
          <Link href="/" className="btn-primary no-underline mt-3 inline-flex">
            Открыть план 1-го года
          </Link>
        </div>
        <div className="card p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            2-й год (свыше года) — готовится
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {NP_STAGE.year2.hoursPerWeek} ч/нед
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {NP_STAGE.year2.hoursPerYear} ч в год. Добавляются специальная физическая и
            интегральная подготовка. План 2-го года появится следующим обновлением.
          </p>
        </div>
      </div>

      {/* Годовой учебно-тренировочный план */}
      <h2 className="section-title mb-3">Годовой учебно-тренировочный план (часы)</h2>
      <div className="card p-0 mb-8 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-3 font-bold">Вид подготовки</th>
              <th className="px-3 py-3 font-bold text-center">
                ФССП, 1-й год
              </th>
              <th className="px-3 py-3 font-bold text-center text-brand-600 dark:text-brand-400">
                Наш план
              </th>
              <th className="px-3 py-3 font-bold text-center">ФССП, 2-й год</th>
              <th className="px-3 py-3 font-bold text-center text-ocean-600 dark:text-ocean-400">
                План 2-го года
              </th>
            </tr>
          </thead>
          <tbody>
            {NP_PLAN_HOURS.map((r) => (
              <tr
                key={r.kind}
                className="border-b border-slate-50 dark:border-slate-800/50 last:border-0"
              >
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{r.kind}</td>
                <td className="px-3 py-2.5 text-center text-slate-500 dark:text-slate-400 tabular-nums">
                  {r.fsspYear1}
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                  {r.ourYear1 ?? '—'}
                </td>
                <td className="px-3 py-2.5 text-center text-slate-500 dark:text-slate-400 tabular-nums">
                  {r.fsspYear2}
                </td>
                <td className="px-3 py-2.5 text-center font-bold text-ocean-600 dark:text-ocean-400 tabular-nums">
                  {r.ourYear2 ?? '—'}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50 dark:bg-slate-800/40 font-extrabold">
              <td className="px-4 py-3 text-slate-900 dark:text-white">Итого за год</td>
              <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300 tabular-nums">
                {NP_PLAN_TOTALS.fsspYear1}
              </td>
              <td className="px-3 py-3 text-center text-brand-600 tabular-nums">
                {NP_PLAN_TOTALS.ourYear1}
              </td>
              <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-300 tabular-nums">
                {NP_PLAN_TOTALS.fsspYear2}
              </td>
              <td className="px-3 py-3 text-center text-ocean-600 tabular-nums">
                {NP_PLAN_TOTALS.ourYear2}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Нормативы */}
      <h2 className="section-title mb-1">Контрольно-переводные нормативы ОФП</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Для зачисления (1-й год) и перевода (2-й год), дисциплина «весовая категория».
      </p>
      <div className="card p-0 mb-8 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-3 font-bold" rowSpan={2}>
                Упражнение
              </th>
              <th className="px-3 py-3 font-bold text-center" colSpan={2}>
                Зачисление (до года)
              </th>
              <th className="px-3 py-3 font-bold text-center" colSpan={2}>
                Перевод (свыше года)
              </th>
            </tr>
            <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-3 pb-2 text-center font-semibold">мальчики</th>
              <th className="px-3 pb-2 text-center font-semibold">девочки</th>
              <th className="px-3 pb-2 text-center font-semibold">мальчики</th>
              <th className="px-3 pb-2 text-center font-semibold">девочки</th>
            </tr>
          </thead>
          <tbody>
            {NP_NORMS.map((n) => (
              <tr
                key={n.exercise}
                className="border-b border-slate-50 dark:border-slate-800/50 last:border-0"
              >
                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">
                  {n.exercise}
                  <span className="text-xs text-slate-400 ml-1.5">
                    ({n.unit}, не {n.better === 'меньше' ? 'более' : 'менее'})
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center font-bold tabular-nums text-slate-800 dark:text-slate-100">
                  {n.y1Boys}
                </td>
                <td className="px-3 py-2.5 text-center font-bold tabular-nums text-slate-800 dark:text-slate-100">
                  {n.y1Girls}
                </td>
                <td className="px-3 py-2.5 text-center font-bold tabular-nums text-slate-800 dark:text-slate-100">
                  {n.y2Boys}
                </td>
                <td className="px-3 py-2.5 text-center font-bold tabular-nums text-slate-800 dark:text-slate-100">
                  {n.y2Girls}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Теория по месяцам */}
      <h2 className="section-title mb-1">Теоретическая подготовка по месяцам</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Учебно-тематический план для этапа НП — короткие беседы в начале или конце занятия.
      </p>
      <div className="space-y-2 mb-8">
        {NP_THEORY.map((t) => (
          <div key={t.topic} className="card p-4 flex items-start gap-3">
            <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-ocean-100 dark:bg-ocean-900/40 text-ocean-700 dark:text-ocean-300 w-24 text-center">
              {t.month}
            </span>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-500" /> {t.topic}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Требования к результатам */}
      <h2 className="section-title mb-3">Программный материал: что должен уметь ученик</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div className="card p-5">
          <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-500" /> К концу 1-го года
          </div>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            {NP_REQUIREMENTS.year1.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-ocean-500" /> К концу 2-го года
          </div>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
            {NP_REQUIREMENTS.year2.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Итоги этапа */}
      <div className="card p-5 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
        <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Результаты прохождения этапа
          (п. 12.1 программы)
        </div>
        <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
          {NP_STAGE_GOALS.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
          <ClipboardCheck className="w-3.5 h-3.5" />
          Контрольно-переводные нормативы принимаются ежегодно; без их выполнения перевод на
          следующий этап не допускается.
        </p>
      </div>
    </PageShell>
  );
}
