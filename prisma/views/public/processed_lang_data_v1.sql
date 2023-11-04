SELECT
  t.id,
  t.rest_countries_common AS common,
  t.rest_countries_official AS official,
  t.rest_countries_nativename AS "nativeName",
  t.rest_countries_to_cia_fuzzy_official_top_country AS fuzzy_official_top_country,
  t.rest_countries_to_cia_fuzzy_official_top_country_similarity AS fuzzy_official_top_country_similarity,
  t.rest_countries_to_cia_fuzzy_common_top_country AS fuzzy_common_top_country,
  t.rest_countries_to_cia_fuzzy_common_top_country_similarity AS fuzzy_common_top_country_similarity,
  t.rest_countries_to_cia_max_score_between_common_and_official AS max_official_score_between_common_and_official,
  t.cia_country AS country,
  t.cia_primary_language AS primary_language,
  t.cia_to_wiki_fuzzy_top_country_or_region AS fuzzy_top_country_or_region,
  t.cia_to_wiki_fuzzy_top_country_or_region_similarity AS fuzzy_top_country_or_region_similarity,
  t.wiki_widely_spoken AS widely_spoken,
  t.wiki_country_or_region AS country_or_region,
  t.wiki_minority_language AS minority_language,
  t.wiki_national_language AS national_language,
  t.wiki_official_language AS official_language,
  t.wiki_regional_language AS regional_language,
  t.wiki_primary_language_wiki AS primary_language_wiki,
  t.rest_countries_api_data_names_id
FROM
  processed_lang_data t
WHERE
  (
    (
      t.rest_countries_to_cia_max_score_between_common_and_official > 75
    )
    AND (
      t.cia_to_wiki_fuzzy_top_country_or_region_similarity > 85
    )
  );