INSERT INTO course_content (slug) VALUES ('ok-slug') ON CONFLICT (slug) DO NOTHING;
