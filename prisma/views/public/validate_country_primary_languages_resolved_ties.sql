SELECT
  cplrt.country_id,
  count(cplrt.country_id) AS country_count
FROM
  country_primary_languages_resolved_ties cplrt
GROUP BY
  cplrt.country_id
HAVING
  (count(cplrt.country_id) > 1);