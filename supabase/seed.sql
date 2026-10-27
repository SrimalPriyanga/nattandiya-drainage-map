-- Sample data for LOCAL development only (`supabase db reset` runs this file).
-- Do not run it against the production database.

insert into public.drainage_reports (latitude, longitude, category, description, status)
values
  (7.4172, 79.8671, 'blocked_drain',
   'Sample: roadside drain near the town centre is blocked with plastic waste.', 'pending'),
  (7.4121, 79.8598, 'canal_issue',
   'Sample: canal bank has collapsed and water overflows onto the road after rain.', 'in_progress'),
  (7.4233, 79.8752, 'illegal_construction',
   'Sample: new wall built across the natural water path behind the paddy field.', 'pending'),
  (7.4088, 79.8714, 'other',
   'Sample: culvert under the side road is too small and floods every monsoon.', 'resolved'),
  (7.4195, 79.8560, 'blocked_drain',
   'Sample: drain cover missing and the drain is full of silt.', 'pending');
