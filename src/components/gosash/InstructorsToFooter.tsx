import Icon from "@/components/ui/icon";
import { instructors, LOGO_URL, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

export default function InstructorsToFooter() {

  return (
    <>


      {/* ============ REVIEWS ============ */}
      <section id="reviews" className="py-20" style={{ background: "#f4f4f4" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase">Довольные выпускники о нас</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Мавиле Хашимова", source: "Яндекс карты", text: "Хочу выразить искреннюю благодарность автошколе за качественное обучение и профессиональный подход. Занятия по теории проходили понятно и интересно, материал объяснялся доступно, с примерами из реальных дорожных ситуаций. Практические занятия были особенно полезными: инструктор терпеливый, внимательный, всегда поддерживал и помогал разобраться в сложных моментах. Благодаря такому обучению я почувствовала уверенность за рулём и успешно сдала экзамены. Очень рада, что выбрала именно эту автошколу!", stars: 5 },
              { name: "Анжела К.", source: "Яндекс карты", text: "Лучшая автошкола! Много лет хотела сесть за руль, боялась... Но девочки администраторы всё рассказали, объяснили. Инструктор по теории Павел Михайлович и инструктор по вождению Рейнгард Илья просто супер люди! Всё настолько понятно и доходчиво объясняли, сдала экзамен и теорию и практику с первого раза только благодаря этим супер людям! Очень благодарна ГОСАВТОШКОЛЕ, я езжу за рулём каждый день. Вы молодцы, хорошее дело делаете!", stars: 5 },
              { name: "Валентина Власенко", source: "Яндекс карты", text: "Идеальное сочетание профессионализма и человеческого подхода! Я прошла обучение в данной автошколе и могу с уверенностью сказать: это был лучший выбор! Организация на высоте — это заслуга менеджера Кузнецовой Анны Игоревны. Отдельная похвала преподавателю теории Юрса Богдану Юлиановичу — ПДД превратились в простую и понятную логику. Настоящий восторг — инструктор по вождению Ускач Андрей Михайлович! Процесс обучения был максимально комфортным, и я полюбила водить автомобиль!", stars: 5 },
              { name: "Алина Тодорская", source: "Яндекс карты", text: "Хочется выразить благодарность Госавтошколе за высокий уровень профессионализма! Ни капли не пожалела, что выбрала именно эту школу. Спасибо большое Богдану Юлиановичу — ни одну тему я не заучивала, всё просто запоминалось благодаря примерам и интересному объяснению! Отдельное огромнейшее спасибо инструктору Ускач Андрей Михайлович — это человек с даром от бога обучать людей вождению. Благодаря ему я не боюсь ездить!", stars: 5 },
            ].map((r) => (
              <div key={r.name} className="border border-white/10 rounded-2xl p-6" style={{ background: "#2e2e2e" }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <span key={i} className="text-red-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{r.name}</p>
                    <p className="text-white/40 text-xs">{r.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LEAD FORM (FOOTER CTA) ============ */}
      <section id="lead-form" className="py-20" style={{ background: "#2e2e2e" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-3">Начните сегодня</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
                Остались вопросы?<br />
                <span className="text-red-500">Запишитесь</span> на бесплатную консультацию
              </h2>
              <div className="space-y-3 text-white/70 text-sm">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={18} className="text-red-500 flex-shrink-0" fallback="Circle" />
                  <a href={`tel:${PHONE}`} className="text-red-500 font-bold text-lg hover:text-red-400">{PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" size={18} className="text-red-500 flex-shrink-0" fallback="Circle" />
                  <a href="https://yandex.ru/maps/-/CPBAfQLi" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">Киевская ул., 41, Симферополь</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={18} className="text-red-500 flex-shrink-0" fallback="Circle" />
                  <span>Пн–Пт: 10:00–18:30</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-7 border border-white/10" style={{ background: "#3a3a3a" }}>
              <LeadForm
                title="Отправить заявку"
                subtitle="Перезвоним в течение 15 минут"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/10 py-8" style={{ background: "#2e2e2e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <img src={LOGO_URL} alt="ГОСАШ" className="h-10 object-contain" />
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              <a href="#tariffs" className="hover:text-red-500 transition-colors">Тарифы</a>
              <a href="#instructors" className="hover:text-red-500 transition-colors">Инструкторы</a>
              <a href="#about" className="hover:text-red-500 transition-colors">Филиалы</a>
              <a href="#contacts" className="hover:text-red-500 transition-colors">Контакты</a>
            </div>
            <a href={`tel:${PHONE}`} className="text-red-500 font-bold hover:text-red-400 transition-colors">
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