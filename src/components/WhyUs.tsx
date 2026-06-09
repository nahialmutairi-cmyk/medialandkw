import { useState, useEffect, useRef, ReactNode } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Users, BarChart3, Target, Award, Lightbulb, TrendingUp, ShieldCheck } from 'lucide-react';

interface StatProps {
  key?: any;
  label: string;
  targetValue: number;
  suffix: string;
  icon: ReactNode;
}

function StatCard({ label, targetValue, suffix, icon }: StatProps) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          let current = 0;
          const duration = 2000; // 2 seconds
          const stepTime = Math.max(Math.floor(duration / targetValue), 15);
          const increment = Math.ceil(targetValue / (duration / stepTime));
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
              setCount(targetValue);
              setFinished(true);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, stepTime);

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [targetValue]);

  return (
    <div
      ref={cardRef}
      className="bg-[#12141E] p-6 rounded-2xl border border-white/5 relative group cursor-pointer transition-all duration-300 hover:border-blue-500/20 hover:-translate-y-1.5 shadow-lg select-none flex flex-col items-center justify-center overflow-hidden"
    >
      {/* CSS Confetti Burst (6 particles centered at card core) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-0">
        <span className="confetti-particle confetti-particle-1 bg-[#0055FF]" />
        <span className="confetti-particle confetti-particle-2 bg-[#FF3E55]" />
        <span className="confetti-particle confetti-particle-3 bg-yellow-400" />
        <span className="confetti-particle confetti-particle-4 bg-[#0055FF]" />
        <span className="confetti-particle confetti-particle-5 bg-[#FF3E55]" />
        <span className="confetti-particle confetti-particle-6 bg-teal-400" />
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-gray-400 mb-4 transition-all duration-[1200ms] ${
          finished ? 'rotate-[360deg] text-[#0055FF] bg-blue-500/10' : ''
        } group-hover:scale-110`}
      >
        {icon}
      </div>

      <div className="text-4xl font-black font-display text-white tracking-tight flex items-baseline gap-0.5">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 font-sans font-black">
          {count}
        </span>
        <span className="text-[#FF3E55] font-black text-2xl font-display">{suffix}</span>
      </div>

      <p className="text-gray-400 text-xs font-semibold font-display mt-2 tracking-wide text-center">
        {label}
      </p>
    </div>
  );
}

export function WhyUs() {
  const stats: StatProps[] = [
    {
      label: "عميل كويتي سعيد",
      targetValue: 120,
      suffix: "+",
      icon: <Users className="w-6 h-6" />
    },
    {
      label: "حملة إعلانية ناجحة",
      targetValue: 350,
      suffix: "+",
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      label: "مليون ظهور إعلامي",
      targetValue: 15,
      suffix: "M+",
      icon: <Target className="w-6 h-6" />
    },
    {
      label: "نسبة رضا العملاء",
      targetValue: 98,
      suffix: "%",
      icon: <Award className="w-6 h-6" />
    }
  ];

  const valuePoints = [
    {
      title: "الاستهداف الجغرافي الذكي بالكويت",
      desc: "نصمم حملات استهداف بالغة الدقة لتصل لعملائك الفعليين في العاصمة، السالمية، حولي، الفحيحيل، والجهراء بفضل خبرتنا العميقة بطبائع السوق الكويتي.",
      icon: <Target className="w-8 h-8 text-[#0055FF]" />
    },
    {
      title: "أفكار إعلانية فورية ومبتكرة",
      desc: "لا نكرر القوالب التقليدية. نبتكر محتوى مرئياً وحلول عرض استثنائية تسلط الضوء الساطع على فرادة وتفاضل علامتك التجارية من اللحظة الأولى.",
      icon: <Lightbulb className="w-8 h-8 text-[#FF3E55]" />
    },
    {
      title: "تحليلات أسبوعية مدعومة بالبيانات",
      desc: "شفافية وحوكمة مخرجاتك التسويقية. نشاركك تقارير بيانية تفصيلية أسبوعياً لقياس العائد على الاستثمار، وتوجيه ميزانياتك للأقسام الأكثر ربحية.",
      icon: <TrendingUp className="w-8 h-8 text-[#0055FF]" />
    }
  ];

  return (
    <div className="space-y-16">
      {/* 4 Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            targetValue={stat.targetValue}
            suffix={stat.suffix}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* 3 Value Points Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {valuePoints.map((item, idx) => (
          <ScrollReveal key={idx} delay={idx * 150} className="h-full">
            <div className="bg-[#12141E] p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed text-justify">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>ضمان الجودة والدقة • HIGH FIDELITY</span>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
