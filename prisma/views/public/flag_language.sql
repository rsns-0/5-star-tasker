SELECT
  dfe.id,
  dfe.value AS flag_key,
  ce.emoji AS flag_emoji,
  full_country_primary_languages.country_name,
  full_country_primary_languages.primary_language,
  full_country_primary_languages.primary_language_id,
  full_country_primary_languages.cca2,
  full_country_primary_languages.cca3,
  full_country_primary_languages.iso1,
  full_country_primary_languages.iso2,
  full_country_primary_languages.iso2b,
  CASE
    WHEN (dlsl.id IS NOT NULL) THEN TRUE
    ELSE false
  END AS is_supported_by_deep_l,
  full_country_primary_languages.country_name_weight,
  full_country_primary_languages.language_name_weight,
  full_country_primary_languages.primary_language_weight
FROM
  (
    (
      (
        discord_flag_emojis dfe
        JOIN full_country_primary_languages ON (
          (
            full_country_primary_languages.country_id = dfe.country_id
          )
        )
      )
      LEFT JOIN LATERAL (
        SELECT
          dlsl_1.id
        FROM
          deep_l_supported_languages dlsl_1
        WHERE
          (dlsl_1.languages_id = dfe."languagesId")
        LIMIT
          1
      ) dlsl ON (TRUE)
    )
    JOIN country_emoji ce ON (
      (
        ce.rest_countries_api_new_data_id = dfe.country_id
      )
    )
  );