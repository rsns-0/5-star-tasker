SELECT
  country_primary_languages.country_id,
  country_primary_languages.country_name,
  country_primary_languages.primary_language,
  country_primary_languages.primary_language_id,
  country_primary_languages.country_name_weight,
  country_primary_languages.language_name_weight,
  country_primary_languages.primary_language_weight,
  rcand.cca2,
  rcand.cca3,
  l.iso_639_1 AS iso1,
  l.iso_639_2 AS iso2,
  l.iso_639_2b AS iso2b
FROM
  (
    (
      country_primary_languages
      LEFT JOIN rest_countries_api_new_data rcand ON (
        (country_primary_languages.country_id = rcand.id)
      )
    )
    LEFT JOIN languages l ON (
      (
        country_primary_languages.primary_language_id = l.id
      )
    )
  );