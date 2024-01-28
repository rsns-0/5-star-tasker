WITH cte1 AS (
  SELECT
    primary_language_raw.country_id,
    primary_language_raw.language_id,
    primary_language_raw.rank,
    primary_language_raw.weight,
    primary_language_raw.country_name,
    primary_language_raw.language_name
  FROM
    primary_language_raw
),
cte2 AS (
  SELECT
    cte1_1.country_id,
    count(cte1_1.rank) AS count
  FROM
    cte1 cte1_1
  WHERE
    (cte1_1.rank = 1)
  GROUP BY
    cte1_1.country_id
  HAVING
    (count(cte1_1.rank) > 1)
)
SELECT
  cte1.country_id,
  cte1.language_id,
  cte1.weight,
  cte1.country_name,
  cte1.language_name
FROM
  (
    cte1
    JOIN cte2 ON ((cte1.country_id = cte2.country_id))
  )
WHERE
  (cte1.rank = 1)
ORDER BY
  cte1.country_id,
  cte1.language_id;