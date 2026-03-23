import Icon from "@/components/ui/icon";

export default function FinanceSection() {
  return (
    <section id="finance" className="py-20 text-white" style={{ background: "#2e2e2e" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3 uppercase">Платите как удобно</h2>
          <p className="text-white/70 max-w-xl mx-auto">Рассрочка 0% или кредит от Т-Банка</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl p-8 border border-white/15" style={{ background: "#3a3a3a" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Icon name="Percent" size={22} className="text-white" fallback="Star" />
              </div>
              <div>
                <h3 className="text-xl font-black">Рассрочка 0%</h3>
                <p className="text-white/60 text-sm">Выгодно — без переплат</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                ["Срок", "3, 4 или 6 месяцев"],
                ["Переплата", "0% — платит школа"],
                ["Первый платёж", "Через месяц"],
                ["Дата платежа", "Любая удобная"],
                ["Доступно для", "Приоритет, Углублённый, ВИП"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start text-sm border-b border-white/10 pb-2">
                  <span className="text-white/60">{k}</span>
                  <span className="text-white font-semibold text-right ml-4">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-8 border border-white/15" style={{ background: "#3a3a3a" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Icon name="CreditCard" size={22} className="text-white" fallback="Star" />
              </div>
              <div>
                <h3 className="text-xl font-black">Кредит</h3>
                <p className="text-white/60 text-sm">Гибко — минимальный платёж</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                ["Срок", "до 24 месяцев"],
                ["Сумма", "от 3 000 до 500 000 ₽"],
                ["Решение", "За несколько минут"],
                ["Доступно", "На всех тарифах"],
                ["Платёж", "Минимальный ежемесячный"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start text-sm border-b border-white/10 pb-2">
                  <span className="text-white/60">{k}</span>
                  <span className="text-white font-semibold text-right ml-4">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-8 border border-white/15 mb-8" style={{ background: "#3a3a3a" }}>
          <h3 className="text-xl font-black mb-6 text-center uppercase">Как оформить за 3 шага</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "1", text: "Заполните онлайн-заявку на нашем сайте" },
              { num: "2", text: "Дождитесь одобрения — обычно в течение дня" },
              { num: "3", text: "Заключите договор и начните обучение" },
            ].map(s => (
              <div key={s.num} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                  {s.num}
                </div>
                <p className="text-white/80 text-sm leading-relaxed pt-1.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="#lead-form" className="btn-accent text-base px-10 py-4">
            Оформить заявку
          </a>
        </div>

        <div className="mt-8 p-4 rounded-xl border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-white/40 text-xs leading-relaxed text-center">
            * Кредитные продукты предоставляются АО «Тинькофф Банк» (Т-Банк). Процентная ставка — от 6,709% до 70% годовых. Сумма и срок определяются банком индивидуально. Период охлаждения — 4 часа (в соответствии с ФЗ № 9-ФЗ). Подробности на сайте tbank.ru.
          </p>
        </div>
      </div>
    </section>
  );
}
