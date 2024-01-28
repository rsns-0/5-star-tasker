WITH country_counts AS (
  SELECT
    le.id,
    le.name,
    count(le.name) AS name_count
  FROM
    country_entries le
  GROUP BY
    le.id,
    le.name
),
ranked_countries AS (
  SELECT
    country_counts.id,
    country_counts.name,
    country_counts.name_count,
    row_number() OVER (
      PARTITION BY country_counts.id
      ORDER BY
        country_counts.name_count DESC,
        country_counts.name DESC
    ) AS rank
  FROM
    country_counts
),
top_countries AS (
  SELECT
    ranked_countries.id,
    ranked_countries.name,
    ranked_countries.name_count AS weight
  FROM
    ranked_countries
  WHERE
    (ranked_countries.rank = 1)
)
SELECT
  tl.id,
  rcand.cca3,
  rcand.cca2,
  tl.name,
  tl.weight
FROM
  (
    top_countries tl
    JOIN rest_countries_api_new_data rcand ON ((tl.id = rcand.id))
  );