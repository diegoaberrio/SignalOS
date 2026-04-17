INSERT INTO roles (code, name, description)
VALUES
    ('admin', 'Administrador', 'Acceso global a operación, usuarios y registros'),
    ('sales_user', 'Usuario comercial', 'Acceso a consulta y explotación comercial');

INSERT INTO interaction_intentions (code, name, description)
VALUES
    ('explore_zone', 'Explorar zona', 'Interés general por explorar una zona o territorio'),
    ('find_opportunity', 'Buscar oportunidad', 'Búsqueda activa de oportunidades o encaje'),
    ('check_affinity', 'Evaluar afinidad', 'Interacción orientada a afinidad o compatibilidad'),
    ('request_contact', 'Solicitar contacto', 'Muestra una intención más directa de seguimiento');