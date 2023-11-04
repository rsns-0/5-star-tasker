WITH cte1 AS (
  SELECT
    joined_processed_lang_data_v1.id,
    joined_processed_lang_data_v1.primary_language AS cia_language,
    joined_processed_lang_data_v1.primary_language_wiki AS wiki_language,
    joined_processed_lang_data_v1.rest_countries_primary_language AS rest_language,
    similarity(
      joined_processed_lang_data_v1.primary_language,
      joined_processed_lang_data_v1.primary_language_wiki
    ) AS cia_to_wiki_similarity,
    similarity(
      joined_processed_lang_data_v1.primary_language,
      joined_processed_lang_data_v1.rest_countries_primary_language
    ) AS cia_to_rest_similarity,
    similarity(
      joined_processed_lang_data_v1.primary_language_wiki,
      joined_processed_lang_data_v1.rest_countries_primary_language
    ) AS wiki_to_rest_similarity
  FROM
    joined_processed_lang_data_v1
)
SELECT
  cte1.id,
  cte1.cia_language,
  cte1.wiki_language,
  cte1.rest_language,
  cte1.cia_to_wiki_similarity,
  cte1.cia_to_rest_similarity,
  cte1.wiki_to_rest_similarity,
  (
    (
      cte1.cia_to_wiki_similarity + cte1.cia_to_rest_similarity
    ) + cte1.wiki_to_rest_similarity
  ) AS sum
FROM
  cte1;