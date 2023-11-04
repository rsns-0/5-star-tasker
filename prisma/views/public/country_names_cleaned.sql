WITH cte AS (
  SELECT
    DISTINCT calculations.left_country_name AS original_value
  FROM
    calculations
  LIMIT
    5000
)
SELECT
  cte.original_value,
  clean_country_name(cte.original_value) AS new_value
FROM
  cte;