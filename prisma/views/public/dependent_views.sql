WITH view_deps AS (
  SELECT
    dependent_view.relname AS dependent_view,
    source_table.relname AS source_table,
    pg_attribute.attname AS column_name,
    CASE
      WHEN (source_table.relkind = 'v' :: "char") THEN 'view' :: text
      WHEN (source_table.relkind = 'r' :: "char") THEN 'table' :: text
      ELSE 'unknown' :: text
    END AS table_type,
    c2.data_type
  FROM
    (
      (
        (
          (
            (
              pg_depend
              JOIN pg_rewrite ON ((pg_depend.objid = pg_rewrite.oid))
            )
            JOIN pg_class dependent_view ON ((pg_rewrite.ev_class = dependent_view.oid))
          )
          JOIN pg_class source_table ON ((pg_depend.refobjid = source_table.oid))
        )
        JOIN pg_attribute ON (
          (
            (pg_depend.refobjid = pg_attribute.attrelid)
            AND (pg_depend.refobjsubid = pg_attribute.attnum)
          )
        )
      )
      JOIN information_schema.columns c2 ON ((source_table.relname = (c2.table_name) :: name))
    )
  WHERE
    ((c2.table_schema) :: name = 'public' :: name)
),
column_agg AS (
  SELECT
    v.dependent_view,
    v.source_table,
    v.table_type,
    jsonb_agg(
      jsonb_build_object('name', v.column_name, 'type', v.data_type)
    ) AS COLUMNS
  FROM
    view_deps v
  GROUP BY
    v.dependent_view,
    v.source_table,
    v.table_type
),
final_agg AS (
  SELECT
    column_agg.dependent_view AS name,
    jsonb_agg(
      jsonb_build_object(
        'name',
        column_agg.source_table,
        'type',
        column_agg.table_type,
        'columns',
        column_agg.columns
      )
    ) AS TABLES
  FROM
    column_agg
  GROUP BY
    column_agg.dependent_view
)
SELECT
  final_agg.name,
  final_agg.tables
FROM
  final_agg;