WITH tkc AS (
  SELECT
    tc.table_schema,
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
  FROM
    (
      (
        information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON (
          (
            (
              (tc.constraint_name) :: name = (kcu.constraint_name) :: name
            )
            AND (
              (tc.table_schema) :: name = (kcu.table_schema) :: name
            )
          )
        )
      )
      JOIN information_schema.constraint_column_usage ccu ON (
        (
          (ccu.constraint_name) :: name = (tc.constraint_name) :: name
        )
      )
    )
  WHERE
    (
      ((tc.constraint_type) :: text = 'FOREIGN KEY' :: text)
      AND ((tc.table_schema) :: name = 'public' :: name)
    )
),
table_info AS (
  SELECT
    c_1.table_name,
    c_1.data_type,
    c_1.column_name,
    c_1.is_nullable
  FROM
    information_schema.columns c_1
  WHERE
    ((c_1.table_schema) :: name = 'public' :: name)
),
COLUMNS AS (
  SELECT
    ti.table_name,
    jsonb_agg(
      jsonb_build_object('type', ti.data_type, 'name', ti.column_name)
    ) AS COLUMNS
  FROM
    table_info ti
  GROUP BY
    ti.table_name
)
SELECT
  tkc.constraint_name,
  tkc.table_name,
  tkc.column_name,
  tkc.foreign_table_name,
  tkc.foreign_column_name,
  c.columns AS table_columns,
  c2.columns AS foreign_table_columns
FROM
  (
    (
      tkc
      JOIN COLUMNS c ON (((tkc.table_name) :: name = (c.table_name) :: name))
    )
    JOIN COLUMNS c2 ON (
      (
        (tkc.foreign_table_name) :: name = (c2.table_name) :: name
      )
    )
  );