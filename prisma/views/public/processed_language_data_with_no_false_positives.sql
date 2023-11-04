SELECT
  t.id,
  t.cia_language,
  t.wiki_language,
  t.rest_language,
  t.cia_to_wiki_similarity,
  t.cia_to_rest_similarity,
  t.wiki_to_rest_similarity,
  t.sum
FROM
  processed_language_data_similarity_scores_base t
WHERE
  (
    LEAST(
      t.wiki_to_rest_similarity,
      t.cia_to_rest_similarity,
      t.cia_to_wiki_similarity
    ) >= (0.5) :: double precision
  );