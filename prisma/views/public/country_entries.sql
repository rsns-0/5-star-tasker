SELECT
  rrcwiwn.id,
  rrcwiwn.type,
  rrcwiwn.iso2,
  rrcwiwn.name,
  (0) :: bigint AS row_number
FROM
  (
    SELECT
      rcand.id,
      'country' :: text AS TYPE,
      rcand.cca3 AS iso2,
      unnest(
        ARRAY [rcadn.official, rcadn.common, rcand.name, c.name, wid.name, c.local_name, ncld.country, wd.country_or_region]
      ) AS name
    FROM
      (
        (
          (
            (
              (
                (
                  rest_countries_api_new_data rcand
                  LEFT JOIN rest_countries_api_data_names rcadn ON (
                    (
                      rcand.rest_countries_api_data_names_id = rcadn.id
                    )
                  )
                )
                LEFT JOIN countries c ON ((rcand.cca3 = c.iso3))
              )
              LEFT JOIN wiki_iso_data wid ON ((c.iso2 = wid.iso2))
            )
            LEFT JOIN iban_country_code_data iccd ON ((rcand.id = iccd.rest_countries_api_new_data_id))
          )
          LEFT JOIN wiki_data wd ON ((rcand.id = wd.rest_countries_api_new_data_id))
        )
        LEFT JOIN new_cia_language_data ncld ON ((rcand.id = ncld.rest_countries_api_new_data_id))
      )
  ) rrcwiwn
WHERE
  (
    (rrcwiwn.name IS NOT NULL)
    AND (rrcwiwn.name <> '' :: text)
  );