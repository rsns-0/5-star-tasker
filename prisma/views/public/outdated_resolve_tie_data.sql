SELECT
  rtd.id,
  rtd.rest_countries_api_new_data_id,
  rtd.languages_id
FROM
  (
    resolve_tie_data rtd
    LEFT JOIN ties2 t ON (
      (
        rtd.rest_countries_api_new_data_id = t.country_id
      )
    )
  )
WHERE
  (t.country_id IS NULL);