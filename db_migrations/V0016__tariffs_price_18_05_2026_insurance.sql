-- Прайс от 18.05.2026: добавляем "ученическая страховка включена в стоимость" во все программы прайса
UPDATE t_p1235792_landing_creation_tz.gosash_tariffs
SET features = features || '["Ученическая страховка включена в стоимость"]'::jsonb,
    updated_at = now()
WHERE id IN (9, 10, 1, 2, 3, 4, 5, 6, 7)
  AND NOT (features @> '["Ученическая страховка включена в стоимость"]'::jsonb);