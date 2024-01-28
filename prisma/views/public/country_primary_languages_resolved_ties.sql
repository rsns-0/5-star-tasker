WITH add_tie_data AS (
  SELECT
    plr.country_id,
    plr.language_id,
    CASE
      WHEN (r.languages_id IS NULL) THEN plr.weight
      ELSE (plr.weight + 10)
    END AS weight,
    plr.country_name,
    plr.language_name
  FROM
    (
      primary_language_raw plr
      LEFT JOIN up_to_date_resolve_tie_data r ON (
        (
          (
            plr.country_id = r.rest_countries_api_new_data_id
          )
          AND (plr.language_id = r.languages_id)
        )
      )
    )
),
country_primary_languages_base AS (
  SELECT
    ranked.country_id,
    ranked.language_id,
    ranked.weight,
    ranked.country_name,
    ranked.language_name,
    ranked.rank
  FROM
    (
      SELECT
        add_tie_data.country_id,
        add_tie_data.language_id,
        add_tie_data.weight,
        add_tie_data.country_name,
        add_tie_data.language_name,
        dense_rank() OVER (
          PARTITION BY add_tie_data.country_id
          ORDER BY
            add_tie_data.weight DESC
        ) AS rank
      FROM
        add_tie_data
    ) ranked
  WHERE
    (ranked.rank = 1)
)
SELECT
  country_primary_languages_base.country_id,
  country_primary_languages_base.language_id,
  country_primary_languages_base.weight,
  country_primary_languages_base.country_name,
  country_primary_languages_base.language_name,
  country_primary_languages_base.rank
FROM
  country_primary_languages_base;