import Icon from "@/components/ui/icon";
import { instructors, LOGO_URL, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

export default function InstructorsToFooter() {

  return (
    <>


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
              <a href="#instructors" className="hover:text-yellow-400 transition-colors">Инструкторы</a>
              <a href="#about" className="hover:text-yellow-400 transition-colors">Филиалы</a>
              <a href="#contacts" className="hover:text-yellow-400 transition-colors">Контакты</a>
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