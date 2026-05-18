ALTER TABLE t_p1235792_landing_creation_tz.gosash_tariffs
  ADD COLUMN IF NOT EXISTS old_price integer NULL;

UPDATE t_p1235792_landing_creation_tz.gosash_tariffs SET old_price = 55900 WHERE id = 1;
UPDATE t_p1235792_landing_creation_tz.gosash_tariffs SET old_price = 64900 WHERE id = 2;
UPDATE t_p1235792_landing_creation_tz.gosash_tariffs SET old_price = 73900 WHERE id = 3;