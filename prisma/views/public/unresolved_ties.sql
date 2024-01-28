SELECT
  DISTINCT ties2.country_id,
  ties2.country_name
FROM
  (
    ties2
    LEFT JOIN resolve_tie_data rtd ON (
      (
        ties2.country_id = rtd.rest_countries_api_new_data_id
      )
    )
  )
WHERE
  (rtd.rest_countries_api_new_data_id IS NULL);