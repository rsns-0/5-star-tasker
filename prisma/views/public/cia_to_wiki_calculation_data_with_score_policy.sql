SELECT
  cia_to_wiki_calculation_data.id,
  cia_to_wiki_calculation_data.cia_country_id,
  cia_to_wiki_calculation_data.wiki_country_id,
  cia_to_wiki_calculation_data.ratio,
  cia_to_wiki_calculation_data.token_set_ratio,
  GREATEST(
    cia_to_wiki_calculation_data.token_set_ratio,
    cia_to_wiki_calculation_data.ratio
  ) AS maximum_score
FROM
  cia_to_wiki_calculation_data
WHERE
  (
    (
      GREATEST(
        cia_to_wiki_calculation_data.token_set_ratio,
        cia_to_wiki_calculation_data.ratio
      ) >= 80
    )
    AND (
      GREATEST(
        cia_to_wiki_calculation_data.token_set_ratio,
        cia_to_wiki_calculation_data.ratio
      ) <= 100
    )
  );