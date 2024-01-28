WITH language_counts AS (
  SELECT
    le.id,
    le.name,
    count(le.name) AS name_count
  FROM
    language_entries le
  GROUP BY
    le.id,
    le.name
),
ranked_languages AS (
  SELECT
    language_counts.id,
    language_counts.name,
    language_counts.name_count,
    row_number() OVER (
      PARTITION BY language_counts.id
      ORDER BY
        language_counts.name_count DESC,
        language_counts.name DESC
    ) AS rank
  FROM
    language_counts
),
top_languages AS (
  SELECT
    ranked_languages.id,
    ranked_languages.name,
    ranked_languages.name_count AS weight
  FROM
    ranked_languages
  WHERE
    (ranked_languages.rank = 1)
)
SELECT
  tl.id,
  l.iso_639_1,
  l.iso_639_2,
  tl.name,
  tl.weight,
  l.iso_639_2b
FROM
  (
    top_languages tl
    JOIN languages l ON ((tl.id = l.id))
  );