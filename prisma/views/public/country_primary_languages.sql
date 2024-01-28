WITH combined AS (
  SELECT
    cplrt.country_id,
    cplrt.language_id,
    cplrt.weight,
    cplrt.country_name,
    cplrt.language_name,
    cplrt.rank
  FROM
    country_primary_languages_resolved_ties cplrt
)
SELECT
  ca.id AS country_id,
  ca.name AS country_name,
  la.name AS primary_language,
  la.id AS primary_language_id,
  ca.weight AS country_name_weight,
  la.weight AS language_name_weight,
  (combined.weight) :: integer AS primary_language_weight
FROM
  (
    (
      combined
      JOIN language_aggregated la ON ((combined.language_id = la.id))
    )
    JOIN country_aggregated ca ON ((combined.country_id = ca.id))
  );