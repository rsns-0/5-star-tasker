WITH aggregated AS (
  SELECT
    plr.country_id,
    row_to_json(plr.*) AS properties
  FROM
    (
      SELECT
        primary_language_raw.country_id,
        primary_language_raw.language_id,
        primary_language_raw.rank,
        primary_language_raw.weight,
        primary_language_raw.language_name
      FROM
        primary_language_raw
    ) plr
)
SELECT
  c.id,
  jsonb_agg(aggregated.properties) AS entries,
  c.name
FROM
  (
    aggregated
    JOIN rest_countries_api_new_data c ON ((c.id = aggregated.country_id))
  )
GROUP BY
  c.id,
  c.name;