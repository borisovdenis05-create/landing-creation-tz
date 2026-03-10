import { useState } from "react";
import Icon from "@/components/ui/icon";
import { instructors, faqs, LOGO_URL, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

export default function InstructorsToFooter() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>

      {/* ============ REVIEWS ============ */}
      <section id="reviews" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">Отзывы</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy">Довольные выпускники о нас</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Мавиле Хашимова", source: "Яндекс карты", text: "Хочу выразить искреннюю благодарность автошколе за качественное обучение и профессиональный подход. Занятия по теории проходили понятно и интересно, материал объяснялся доступно, с примерами из реальных дорожных ситуаций. Практические занятия были особенно полезными: инструктор терпеливый, внимательный, всегда поддерживал и помогал разобраться в сложных моментах. Благодаря такому обучению я почувствовала уверенность за рулём и успешно сдала экзамены. Очень рада, что выбрала именно эту автошколу, и с уверенностью могу рекомендовать её всем, кто хочет научиться водить грамотно и безопасно!", stars: 5 },
              { name: "Анжела К.", source: "Яндекс карты", text: "Лучшая автошкола! Много лет хотела сесть за руль, боялась... Но девочки администраторы всё рассказали, объяснили. Инструктор по теории Павел Михайлович и инструктор по вождению Рейнгард Илья просто супер люди! Всё настолько понятно и доходчиво объясняли, сдала экзамен и теорию и практику с первого раза только благодаря этим супер людям! Очень благодарна ГОСАВТОШКОЛЕ, я езжу за рулём каждый день. Вы молодцы, хорошее дело делаете!", stars: 5 },
              { name: "Валентина Власенко", source: "Яндекс карты", text: "Идеальное сочетание профессионализма и человеческого подхода! Я прошла обучение в данной автошколе и могу с уверенностью сказать: это был лучший выбор! Организация на высоте — это заслуга менеджера Кузнецовой Анны Игоревны. Отдельная похвала преподавателю теории Юрса Богдану Юлиановичу — ПДД превратились в простую и понятную логику. Настоящий восторг — инструктор по вождению Ускач Андрей Михайлович! Он настоящий профессионал и наставник. Процесс обучения был максимально комфортным, и я полюбила водить автомобиль!", stars: 5 },
              { name: "Алина Тодорская", source: "Яндекс карты", text: "Хочется выразить благодарность Госавтошколе за высокий уровень профессионализма! Ни капли не пожалела, что выбрала именно эту школу. Спасибо большое Богдану Юлиановичу — ни одну тему я не заучивала, всё просто запоминалось благодаря примерам и интересному объяснению! Отдельное огромнейшее спасибо инструктору Ускач Андрей Михайлович — это человек с даром от бога обучать людей вождению. Благодаря ему я не боюсь ездить и знаю, что в любой ситуации найду выход!", stars: 5 },
            ].map((r) => (
              <div key={r.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BLOG ============ */}
      <section id="blog" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">Полезное</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy">Полезные видеоуроки нашим ученикам</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Как перестать бояться водить", desc: "Советы от инструктора: первые шаги к уверенности на дороге", icon: "Heart", tag: "Психология" },
              { title: "Как общаться с инспектором ГИБДД", desc: "Что говорить и как вести себя при остановке — разбор ситуаций", icon: "Shield", tag: "Право" },
              { title: "Разворот в стеснённых условиях", desc: "Разбираем сложные манёвры шаг за шагом с инструктором", icon: "RotateCcw", tag: "Практика" },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-navy flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy/70" />
                  <div className="relative text-center">
                    <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon name={v.icon} size={24} className="text-navy" fallback="Play" />
                    </div>
                    <span className="text-white/80 text-xs bg-white/10 rounded-full px-3 py-1">{v.tag}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy">Часто задаваемые вопросы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-navy hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className="text-yellow-500 flex-shrink-0 ml-3"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LEAD FORM (FOOTER CTA) ============ */}
      <section id="lead-form" className="py-20 bg-navy">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-3">Начните сегодня</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
                Остались вопросы?<br />
                <span className="text-yellow-400">Запишитесь</span> на бесплатную консультацию
              </h2>
              <div className="space-y-3 text-white/70 text-sm">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={18} className="text-yellow-400 flex-shrink-0" fallback="Circle" />
                  <a href={`tel:${PHONE}`} className="text-yellow-400 font-bold text-lg hover:text-yellow-300">{PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" size={18} className="text-yellow-400 flex-shrink-0" fallback="Circle" />
                  <a href="https://yandex.ru/maps/-/CPBAfQLi" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">Киевская ул., 41, Симферополь</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={18} className="text-yellow-400 flex-shrink-0" fallback="Circle" />
                  <span>Пн–Пт: 10:00–18:30</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-7">
              <LeadForm
                title="Отправить заявку"
                subtitle="Перезвоним в течение 15 минут"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-navy/95 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <img src={LOGO_URL} alt="ГОСАШ" className="h-10 object-contain" />
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              <a href="#tariffs" className="hover:text-yellow-400 transition-colors">Тарифы</a>
              <a href="#about" className="hover:text-yellow-400 transition-colors">Об автошколе</a>
              <a href="#instructors" className="hover:text-yellow-400 transition-colors">Инструкторы</a>
              <a href="#faq" className="hover:text-yellow-400 transition-colors">FAQ</a>
            </div>
            <a href={`tel:${PHONE}`} className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
              {PHONE_DISPLAY}
            </a>
          </div>
          <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/30">
            <p>© 2026 Автошкола ГОСАШ · г. Симферополь, Киевская ул., 41</p>
            <p>Городская. Открытая. Современная.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white/60 transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white/60 transition-colors">Оферта</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}