SELECT
  rtd.id,
  rtd.rest_countries_api_new_data_id,
  rtd.languages_id
FROM
  resolve_tie_data rtd
WHERE
  (
    rtd.rest_countries_api_new_data_id IN (
      SELECT
        ties2.country_id
      FROM
        ties2
    )
  );