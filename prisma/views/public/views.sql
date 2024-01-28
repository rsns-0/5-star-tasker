SELECT
  pg_views.schemaname,
  pg_views.viewname,
  pg_views.viewowner,
  pg_views.definition
FROM
  pg_views
WHERE
  (pg_views.schemaname = 'public' :: name);