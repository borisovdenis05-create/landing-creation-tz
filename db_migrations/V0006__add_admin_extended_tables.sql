-- FAQ
CREATE TABLE IF NOT EXISTS gosash_faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stats (цифры на лендинге)
CREATE TABLE IF NOT EXISTS gosash_stats (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    icon TEXT DEFAULT 'Star',
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Finance blocks (рассрочка/кредит)
CREATE TABLE IF NOT EXISTS gosash_finance (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    icon TEXT DEFAULT 'Percent',
    rows JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Marquee (бегущая строка)
CREATE TABLE IF NOT EXISTS gosash_marquee (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    shape TEXT DEFAULT 'circle',
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Hero features (преимущества под H1)
CREATE TABLE IF NOT EXISTS gosash_hero_features (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Leads (заявки)
CREATE TABLE IF NOT EXISTS gosash_leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    tariff TEXT DEFAULT '',
    promo TEXT DEFAULT '',
    source TEXT DEFAULT '',
    note TEXT DEFAULT '',
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed FAQ defaults
INSERT INTO gosash_faq (question, answer, sort_order) VALUES
('Сколько стоит обучение в автошколе ГОСАШ в Симферополе?', 'Стоимость обучения на права категории B — от 39 900 ₽ (программа Базовый Онлайн). Цены зафиксированы в договоре, скрытых платежей нет. Доступна рассрочка 0% на 3–6 месяцев.', 10),
('Нужна ли медицинская справка для записи в автошколу?', 'Да, медицинская справка формы 003-В/у обязательна до начала вождения. Пройти медосмотр можно в любой аккредитованной клинике Симферополя. Теоретические занятия можно начать и без справки.', 20),
('Можно ли оплатить обучение в рассрочку?', 'Да. Рассрочка 0% на 3, 4 или 6 месяцев без переплат — проценты за вас платит автошкола. Первый платёж через месяц.', 30),
('Можно ли выбрать инструктора по вождению?', 'Да, в программах Приоритет, Углублённый, ВИП, Леди Драйв и Материнский капитал вы можете выбрать инструктора.', 40),
('Как проходит теория — онлайн или офлайн?', 'В большинстве программ доступен выбор: онлайн через личный кабинет или офлайн в учебном классе.', 50),
('Что будет, если не сдам экзамен в ГИБДД с первого раза?', 'Можно записаться на дополнительные занятия по вождению. В среднем наши ученики сдают вождение за 1,9 попытки.', 60),
('На каких автомобилях проходит обучение?', 'Обучение проводится на KIA RIO — не старше 2019 года. Все автомобили оснащены кондиционером. Доступен выбор АКПП или МКПП.', 70),
('Сколько длится обучение в автошколе?', 'Стандартный курс — около 3 месяцев. Расписание гибкое: утро, день, вечер, в том числе выходные.', 80),
('Где находятся филиалы автошколы ГОСАШ?', 'В Симферополе работают 5 учебных классов: на Гагарина, Киевской, Залесской, Самокиша и Лермонтова. Плюс автодром на ул. Титова, 77.', 90);

-- Seed stats
INSERT INTO gosash_stats (value, label, icon, sort_order) VALUES
('94,5%', 'учеников сдают теорию в ГИБДД с первого раза', 'GraduationCap', 10),
('19', 'лицензированных инструкторов в штате', 'Users', 20),
('1,9', 'попытки нужно в среднем для сдачи вождения в городе', 'Car', 30),
('356 лет', 'общий опыт работы инструкторов', 'Award', 40),
('9,4/10', 'оценка качества услуг учениками', 'Star', 50),
('122', 'ученика в год обучает каждый инструктор', 'BookOpen', 60);

-- Seed branches
INSERT INTO gosash_branches (name, addr, rating, map_url, sort_order) VALUES
('Филиал на Гагарина', 'ул. Гагарина, 20А, Симферополь', 5.0, 'https://yandex.ru/maps/-/CPBAb-1K', 10),
('Филиал на Киевской', 'Киевская ул., 41, Симферополь', 5.0, 'https://yandex.ru/maps/-/CPBAfQLi', 20),
('Филиал на Залесской', 'Залесская ул., 121, Симферополь', 4.8, 'https://yandex.ru/maps/-/CPBAjU2Y', 30),
('Филиал на Самокиша', 'ул. Самокиша, 4, Симферополь', 4.9, 'https://yandex.ru/maps/-/CPBAnA6k', 40),
('Филиал на Лермонтова', 'ул. Лермонтова, 13А, Симферополь', 5.0, 'https://yandex.ru/maps/-/CPBArZ88', 50),
('Автодром Титова', 'ул. Титова, 77, Симферополь', 5.0, 'https://yandex.ru/maps/-/CPBAvA4B', 60);

-- Seed marquee
INSERT INTO gosash_marquee (label, shape, sort_order) VALUES
('Обучение ПДД', 'circle', 10),
('Безопасное вождение', 'triangle', 20),
('Категория B', 'circle', 30),
('Автодром', 'square', 40),
('Практика вождения', 'triangle', 50),
('Симферополь', 'circle', 60),
('6 филиалов', 'square', 70);

-- Seed hero features
INSERT INTO gosash_hero_features (label, sort_order) VALUES
('Прозрачные платежи', 10),
('Рассрочка 0%', 20),
('KIA RIO АКПП/МКПП', 30);

-- Seed finance
INSERT INTO gosash_finance (title, subtitle, icon, rows, sort_order) VALUES
('Рассрочка 0%', 'Выгодно — без переплат', 'Percent', '[["Срок","3, 4 или 6 месяцев"],["Переплата","0% — платит школа"],["Первый платёж","Через месяц"],["Дата платежа","Любая удобная"],["Доступно для","Приоритет, Углублённый, ВИП"]]'::jsonb, 10),
('Кредит', 'Гибко — минимальный платёж', 'CreditCard', '[["Срок","до 24 месяцев"],["Сумма","от 3 000 до 500 000 ₽"],["Решение","За несколько минут"],["Доступно","На всех тарифах"],["Платёж","Минимальный ежемесячный"]]'::jsonb, 20);

-- Seed reviews
INSERT INTO gosash_reviews (author, text, rating, source, sort_order) VALUES
('Мавиле Хашимова', 'Хочу выразить искреннюю благодарность автошколе за качественное обучение и профессиональный подход. Занятия по теории проходили понятно и интересно, материал объяснялся доступно, с примерами из реальных дорожных ситуаций. Практические занятия были особенно полезными: инструктор терпеливый, внимательный, всегда поддерживал и помогал разобраться в сложных моментах.', 5, 'Яндекс карты', 10),
('Анжела К.', 'Лучшая автошкола! Много лет хотела сесть за руль, боялась... Но девочки администраторы всё рассказали, объяснили. Инструктор по теории Павел Михайлович и инструктор по вождению Рейнгард Илья просто супер люди! Всё настолько понятно и доходчиво объясняли, сдала экзамен и теорию и практику с первого раза только благодаря этим супер людям!', 5, 'Яндекс карты', 20),
('Валентина Власенко', 'Идеальное сочетание профессионализма и человеческого подхода! Я прошла обучение в данной автошколе и могу с уверенностью сказать: это был лучший выбор! Организация на высоте — это заслуга менеджера Кузнецовой Анны Игоревны. Отдельная похвала преподавателю теории Юрса Богдану Юлиановичу.', 5, 'Яндекс карты', 30),
('Алина Тодорская', 'Хочется выразить благодарность Госавтошколе за высокий уровень профессионализма! Ни капли не пожалела, что выбрала именно эту школу. Спасибо большое Богдану Юлиановичу — ни одну тему я не заучивала, всё просто запоминалось благодаря примерам и интересному объяснению!', 5, 'Яндекс карты', 40);

-- Дополнительные ключи в settings
INSERT INTO gosash_settings (key, value) VALUES
('hero_bg_url', 'https://cdn.poehali.dev/files/e3619330-6419-457e-8867-8459672dfecb.jpg'),
('logo_url', 'https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/bucket/403b7c35-5e7e-4b24-939e-e08d2f087325.png'),
('hero_h1_part1', 'Стань'),
('hero_h1_accent', 'уверенным'),
('hero_h1_part2', 'водителем'),
('hero_desc', 'Городская автошкола Симферополя с вдумчивым подходом и 6 программами обучения.'),
('finance_title', 'Платите как удобно'),
('finance_subtitle', 'Рассрочка 0% или кредит от Т-Банка'),
('faq_title', 'Всё что нужно знать об обучении в ГОСАШ'),
('stats_title', 'ГОСАШ в цифрах'),
('reviews_title', 'Довольные выпускники о нас'),
('promos_title', 'Акции & СКИДКИ'),
('email', 'gosavtosimf+111385@mail.ru')
ON CONFLICT (key) DO NOTHING;
