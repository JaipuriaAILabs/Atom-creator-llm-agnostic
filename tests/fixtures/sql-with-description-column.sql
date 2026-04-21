INSERT INTO course_content (slug, title, description, course_metadata)
VALUES (
  'test-course',
  'Test Course',
  'This should fail — description column does not exist',
  '{}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;
