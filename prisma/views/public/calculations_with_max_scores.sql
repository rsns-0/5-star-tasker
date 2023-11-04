SELECT
  calculations.id,
  calculations.left_country_table,
  calculations.left_country_table_field_name,
  calculations.left_country_id,
  calculations.left_country_name,
  calculations.right_country_table,
  calculations.right_country_table_field_name,
  calculations.right_country_id,
  calculations.right_country_name,
  calculations.ratio,
  calculations.token_set_ratio,
  CASE
    WHEN (
      calculations.ratio > calculations.token_set_ratio
    ) THEN calculations.ratio
    ELSE calculations.token_set_ratio
  END AS maximum_score
FROM
  calculations;