
CREATE TABLE t_p1235792_landing_creation_tz.gosash_promos (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '',
  subtitle    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  badge       TEXT NOT NULL DEFAULT '',
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO t_p1235792_landing_creation_tz.gosash_promos (title, subtitle, description, image_url, badge, active, sort_order) VALUES
('Бесконечная уверенность за рулём', '8 часов за 8 000 ₽', 'Специальная программа для тех, кто хочет быстро преодолеть страх вождения. 8 часов практики с опытным инструктором — только для женщин. Запишитесь сейчас и получите скидку!', 'https://cdn.poehali.dev/files/517c9c30-606e-4d4e-bf36-4451bd75c1f6.jpg', 'Только для женщин', true, 1),
('Вернём 13%', 'При наличии официального трудоустройства', 'Получите налоговый вычет 13% за обучение в нашей автошколе. Мы поможем оформить все необходимые документы для возврата средств через налоговую службу.', 'https://cdn.poehali.dev/files/e9f1ae46-1dbc-4d5f-9ab4-12ef2042b37d.jpg', 'Налоговый вычет', true, 2),
('Он не простит ошибку. Мы научим их не делать', '15 000 ₽ вместо 17 000 ₽', 'Специальный курс репетиции экзамена по вождению. Занятия проходят в формате реального экзамена ГИБДД. Акция действует с 20 по 31 марта!', 'https://cdn.poehali.dev/files/375bf488-40fb-4d56-8e8a-b68eb09cfcb2.jpg', '20–31 марта', true, 3);
