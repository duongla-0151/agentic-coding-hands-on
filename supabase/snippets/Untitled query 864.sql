insert into public.user_roles (user_id, role)
select id, 'super_admin'
from auth.users
where email = 'le.anh.duong@sun-asterisk.com'
on conflict do nothing;
