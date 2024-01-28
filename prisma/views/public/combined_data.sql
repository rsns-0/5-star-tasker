WITH cia_data AS (
  SELECT
    ncld.id,
    ncld.languages_id AS l_id,
    ncld.rest_countries_api_new_data_id AS c_id,
    'new_cia_language_data' :: text AS source
  FROM
    new_cia_language_data ncld
),
wiki_data AS (
  SELECT
    wd.id,
    wd.rest_countries_api_new_data_id AS c_id,
    wd.languages_id AS l_id,
    'wiki_data' :: text AS source
  FROM
    public.wiki_data wd
),
rest_countries_data AS (
  SELECT
    rcand.id,
    rcand.id AS c_id,
    l.id AS l_id,
    'rest_countries_api_new_data' :: text AS source
  FROM
    (
      (
        rest_countries_api_new_data rcand
        JOIN "_languagesTorest_countries_api_new_data" rcand_l ON ((rcand_l."B" = rcand.id))
      )
      JOIN languages l ON ((l.id = rcand_l."A"))
    )
),
combined_data AS (
  SELECT
    cia_data.id,
    cia_data.c_id,
    cia_data.l_id,
    cia_data.source
  FROM
    cia_data
  UNION
  ALL
  SELECT
    wiki_data.id,
    wiki_data.c_id,
    wiki_data.l_id,
    wiki_data.source
  FROM
    wiki_data
  UNION
  ALL
  SELECT
    rest_countries_data.id,
    rest_countries_data.c_id,
    rest_countries_data.l_id,
    rest_countries_data.source
  FROM
    rest_countries_data
)
SELECT
  combined_data.id,
  combined_data.c_id,
  combined_data.l_id,
  combined_data.source
FROM
  combined_data;