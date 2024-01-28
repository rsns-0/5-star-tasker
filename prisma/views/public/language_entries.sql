WITH rest_countries_json_languages AS (
  SELECT
    l.name,
    l.iso_639_2 AS iso2,
    l.id
  FROM
    (
      "_languagesTorest_countries_api_new_data" ltcand
      JOIN languages l ON ((ltcand."A" = l.id))
    )
),
language_entries1 AS (
  SELECT
    lrcln.id,
    lrcln.type,
    lrcln.iso2,
    lrcln.name
  FROM
    (
      SELECT
        l.id,
        'language' :: text AS TYPE,
        l.iso_639_2 AS iso2,
        unnest(
          string_to_array(
            unnest(
              ARRAY [l.name, cim.english_name_of_language, lim.language, ncld.primary_language, wld.name]
            ),
            ';' :: text
          )
        ) AS name
      FROM
        (
          (
            (
              (
                languages l
                LEFT JOIN congress_iso_mappings cim ON ((l.id = cim.languages_id))
              )
              LEFT JOIN lingohub_iso_mappings lim ON ((l.id = lim.languages_id))
            )
            LEFT JOIN new_cia_language_data ncld ON ((l.id = ncld.languages_id))
          )
          LEFT JOIN wals_language_data wld ON ((l.id = wld.languages_id))
        )
    ) lrcln
  WHERE
    (
      (lrcln.name IS NOT NULL)
      AND (lrcln.name <> '' :: text)
    )
)
SELECT
  language_entries1.id,
  language_entries1.type,
  language_entries1.iso2,
  language_entries1.name,
  (0) :: bigint AS row_number
FROM
  language_entries1
UNION
ALL
SELECT
  r.id,
  'language' :: text AS TYPE,
  r.iso2,
  r.name,
  (0) :: bigint AS row_number
FROM
  rest_countries_json_languages r;