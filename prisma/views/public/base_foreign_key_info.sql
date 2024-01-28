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
)
SELECT
  tkc.table_schema,
  tkc.constraint_name,
  tkc.table_name,
  tkc.column_name,
  tkc.foreign_table_schema,
  tkc.foreign_table_name,
  tkc.foreign_column_name
FROM
  tkc;