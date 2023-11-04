SELECT
  t.id,
  t.common,
  t.official,
  t."nativeName",
  t.fuzzy_official_top_country,
  t.fuzzy_official_top_country_similarity,
  t.fuzzy_common_top_country,
  t.fuzzy_common_top_country_similarity,
  t.max_official_score_between_common_and_official,
  t.country,
  t.primary_language,
  t.fuzzy_top_country_or_region,
  t.fuzzy_top_country_or_region_similarity,
  t.widely_spoken,
  t.country_or_region,
  t.minority_language,
  t.national_language,
  t.official_language,
  t.regional_language,
  t.primary_language_wiki,
  t.rest_countries_api_data_names_id,
  rcadl.name AS rest_countries_primary_language
FROM
  (
    (
      (
        processed_lang_data_v1 t
        JOIN rest_countries_api_new_data rcand ON (
          (
            rcand.rest_countries_api_data_names_id = t.rest_countries_api_data_names_id
          )
        )
      )
      JOIN "_rest_countries_api_data_languagesTorest_countries_api_new_data" rcadltcand ON ((rcand.id = rcadltcand."B"))
    )
    JOIN rest_countries_api_data_languages rcadl ON ((rcadltcand."A" = rcadl.id))
  );