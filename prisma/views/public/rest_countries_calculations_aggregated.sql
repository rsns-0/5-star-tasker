WITH base AS (
  SELECT
    calculations_with_max_scores.id,
    calculations_with_max_scores.left_country_table,
    calculations_with_max_scores.left_country_table_field_name,
    calculations_with_max_scores.left_country_id,
    calculations_with_max_scores.left_country_name,
    calculations_with_max_scores.right_country_table,
    calculations_with_max_scores.right_country_table_field_name,
    calculations_with_max_scores.right_country_id,
    calculations_with_max_scores.right_country_name,
    calculations_with_max_scores.ratio,
    calculations_with_max_scores.token_set_ratio,
    calculations_with_max_scores.maximum_score
  FROM
    calculations_with_max_scores
  WHERE
    (
      calculations_with_max_scores.left_country_table = 'rest_countries_api_data_names' :: text
    )
),
create_entity_relation_key AS (
  SELECT
    base.id,
    base.left_country_table,
    base.left_country_table_field_name,
    base.left_country_id,
    base.left_country_name,
    base.right_country_table,
    base.right_country_table_field_name,
    base.right_country_id,
    base.right_country_name,
    base.ratio,
    base.token_set_ratio,
    base.maximum_score,
    (
      SELECT
        ARRAY [(base.left_country_id)::text, base.left_country_table, (base.right_country_id)::text, (base.right_country_id)::text, base.right_country_table, base.right_country_table_field_name, base.right_country_name] AS "array"
    ) AS unique_entity_to_entity_relation_key
  FROM
    base
),
with_rank AS (
  SELECT
    create_entity_relation_key.id,
    create_entity_relation_key.left_country_table,
    create_entity_relation_key.left_country_table_field_name,
    create_entity_relation_key.left_country_id,
    create_entity_relation_key.left_country_name,
    create_entity_relation_key.right_country_table,
    create_entity_relation_key.right_country_table_field_name,
    create_entity_relation_key.right_country_id,
    create_entity_relation_key.right_country_name,
    create_entity_relation_key.ratio,
    create_entity_relation_key.token_set_ratio,
    create_entity_relation_key.maximum_score,
    create_entity_relation_key.unique_entity_to_entity_relation_key,
    row_number() OVER (
      PARTITION BY create_entity_relation_key.unique_entity_to_entity_relation_key
      ORDER BY
        create_entity_relation_key.maximum_score DESC,
        (
          create_entity_relation_key.left_country_table_field_name = 'official' :: text
        ) DESC
    ) AS row_number
  FROM
    create_entity_relation_key
)
SELECT
  with_rank.id,
  with_rank.left_country_table,
  with_rank.left_country_table_field_name,
  with_rank.left_country_id,
  with_rank.left_country_name,
  with_rank.right_country_table,
  with_rank.right_country_table_field_name,
  with_rank.right_country_id,
  with_rank.right_country_name,
  with_rank.ratio,
  with_rank.token_set_ratio,
  with_rank.maximum_score
FROM
  with_rank
WHERE
  (with_rank.row_number = 1);