-- Корректировка прайса ЛЕДИ ДРАЙВ от 18.05.2026: цена 70900, ГСМ 15000 (не включён)
UPDATE t_p1235792_landing_creation_tz.gosash_tariffs
SET price = 70900,
    gsm = 15000,
    features = (
      SELECT jsonb_agg(elem)
      FROM jsonb_array_elements(features) AS elem
      WHERE elem <> '"ГСМ включён в стоимость программы обучения"'::jsonb
    ),
    updated_at = now()
WHERE id = 7;