WITH counts AS (
  SELECT
    combined_data.c_id,
    combined_data.l_id,
    count(combined_data.l_id) AS weight
  FROM
    combined_data
  WHERE
    (
      (combined_data.c_id IS NOT NULL)
      AND (combined_data.l_id IS NOT NULL)
    )
  GROUP BY
    combined_data.c_id,
    combined_data.l_id
  ORDER BY
    combined_data.c_id,
    (count(combined_data.l_id)) DESC
),
ranks AS (
  SELECT
    counts.c_id,
    counts.l_id,
    counts.weight,
    dense_rank() OVER (
      PARTITION BY counts.c_id
      ORDER BY
        counts.weight DESC
    ) AS rank
  FROM
    counts
),
primary_language_raw AS (
  SELECT
    ranks.c_id AS country_id,
    ranks.l_id AS language_id,
    ranks.weight,
    ranks.rank,
    l.name AS language_name,
    rcand.name AS country_name
  FROM
    (
      (
        ranks
        JOIN languages l ON ((l.id = ranks.l_id))
      )
      JOIN rest_countries_api_new_data rcand ON ((rcand.id = ranks.c_id))
    )
)
SELECT
  primary_language_raw.country_id,
  primary_language_raw.language_id,
  primary_language_raw.weight,
  primary_language_raw.rank,
  primary_language_raw.language_name,
  primary_language_raw.country_name
FROM
  primary_language_raw;