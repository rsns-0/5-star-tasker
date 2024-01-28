WITH base AS (
  SELECT
    dependent_view.relname AS dependent_view,
    source_table.relname AS source_table,
    pg_attribute.attname AS column_name
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
      JOIN pg_namespace source_ns ON ((source_ns.oid = source_table.relnamespace))
    )
  WHERE
    (source_ns.nspname = 'public' :: name)
),
source_table_columns AS (
  SELECT
    base.dependent_view,
    base.source_table,
    jsonb_agg(base.column_name) AS column_names
  FROM
    base
  GROUP BY
    base.dependent_view,
    base.source_table
)
SELECT
  source_table_columns.dependent_view,
  jsonb_object_agg(
    source_table_columns.source_table,
    source_table_columns.column_names
  ) AS source_tables
FROM
  source_table_columns
GROUP BY
  source_table_columns.dependent_view;