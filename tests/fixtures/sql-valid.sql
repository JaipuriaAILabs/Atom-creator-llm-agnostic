INSERT INTO course_content (slug, title, course_metadata)
VALUES (
  'test-course',
  'Test Course',
  '{"description": "lives in jsonb"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;
