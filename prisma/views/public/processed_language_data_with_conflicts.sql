SELECT
  pldssb.id,
  pldssb.cia_language,
  pldssb.wiki_language,
  pldssb.rest_language,
  pldssb.cia_to_wiki_similarity,
  pldssb.cia_to_rest_similarity,
  pldssb.wiki_to_rest_similarity,
  (
    (
      pldssb.cia_to_wiki_similarity + pldssb.cia_to_rest_similarity
    ) + pldssb.wiki_to_rest_similarity
  ) AS sum
FROM
  processed_language_data_similarity_scores_base pldssb
WHERE
  (
    (
      (
        floor(
          (pldssb.cia_to_wiki_similarity) :: double precision
        ) <> pldssb.cia_to_wiki_similarity
      )
      AND (
        pldssb.cia_to_wiki_similarity <> (0) :: double precision
      )
    )
    OR (
      (
        floor(
          (pldssb.cia_to_rest_similarity) :: double precision
        ) <> pldssb.cia_to_rest_similarity
      )
      AND (
        pldssb.cia_to_rest_similarity <> (0) :: double precision
      )
    )
    OR (
      (
        floor(
          (pldssb.wiki_to_rest_similarity) :: double precision
        ) <> pldssb.wiki_to_rest_similarity
      )
      AND (
        pldssb.wiki_to_rest_similarity <> (0) :: double precision
      )
    )
  );