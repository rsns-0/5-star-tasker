SELECT
  dfe.value AS flag_key,
  dlsl.abbreviation AS iso_code
FROM
  (
    discord_flag_emojis dfe
    CROSS JOIN LATERAL (
      SELECT
        dlsl_1.abbreviation
      FROM
        deep_l_supported_languages dlsl_1
      WHERE
        (dlsl_1.languages_id = dfe."languagesId")
      LIMIT
        1
    ) dlsl
  );