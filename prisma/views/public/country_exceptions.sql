SELECT
  rcand.id,
  rcand.name
FROM
  rest_countries_api_new_data rcand
WHERE
  (
    rcand.id = ANY (
      ARRAY [437, 403, 260, 449, 390, 479, 275, 263, 309, 267, 480, 290, 322, 358, 484, 370, 472, 413, 281, 315, 490, 453, 481, 458, 384, 332, 300]
    )
  );