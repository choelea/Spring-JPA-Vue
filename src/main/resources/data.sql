
INSERT INTO sys_role (ROLE_NAME) VALUES ('ROLE_USER');
INSERT INTO sys_role (ROLE_NAME) VALUES ('ROLE_ADMIN');

INSERT INTO sys_user (user_id, created_at, updated_at, is_active, email, first_name, is_email_verified, last_name, password, username) VALUES (1, '2025-04-26 10:19:38.212', '2025-04-26 10:19:38.212', 1, 'joe.lea@foxmail.com', NULL, 1, NULL, '$2a$10$ZCnAjISsHRx09Px8uJ7eMunHcF41r8ZB7HkM0gR1/28XZUxNyohbC', 'admin');
INSERT INTO sys_user_authority (user_id, role_id) VALUES (1, 2);
