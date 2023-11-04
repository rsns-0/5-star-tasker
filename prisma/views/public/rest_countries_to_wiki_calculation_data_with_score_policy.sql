SELECT
  rest_countries_to_wiki_calculation_data.id,
  rest_countries_to_wiki_calculation_data.wiki_country_id,
  rest_countries_to_wiki_calculation_data.ratio,
  rest_countries_to_wiki_calculation_data.token_set_ratio,
  rest_countries_to_wiki_calculation_data.rest_countries_name_id,
  GREATEST(
    rest_countries_to_wiki_calculation_data.token_set_ratio,
    rest_countries_to_wiki_calculation_data.ratio
  ) AS maximum_score
FROM
  rest_countries_to_wiki_calculation_data
WHERE
  (
    (
      GREATEST(
        rest_countries_to_wiki_calculation_data.token_set_ratio,
        rest_countries_to_wiki_calculation_data.ratio
      ) >= 80
    )
    AND (
      GREATEST(
        rest_countries_to_wiki_calculation_data.token_set_ratio,
        rest_countries_to_wiki_calculation_data.ratio
      ) <= 100
    )
  );