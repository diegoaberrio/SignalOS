import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  CircleOff,
  CircleUserRound,
  LockKeyhole,
  Pencil,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react';
import useUsers from '../hooks/useUsers';
import StatusCard from '../components/common/StatusCard';
import { create_user, update_user, update_user_status } from '../services/userService';

const role_options = [
  { id: 1, code: 'admin', name: 'Administrador' },
  { id: 2, code: 'sales_user', name: 'Usuario comercial' },
];

const status_options = ['active', 'inactive', 'disabled'];

const initial_create_form = {
  client_account_id: '',
  role_id: '2',
  full_name: '',
  email: '',
  password: '',
  status: 'active',
};

const initial_edit_form = {
  full_name: '',
  email: '',
  password: '',
  role_id: '',
  status: '',
  client_account_id: '',
};

function format_label(value) {
  return String(value || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function format_datetime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function build_create_payload(form_data) {
  return {
    client_account_id: form_data.client_account_id ? Number(form_data.client_account_id) : null,
    role_id: Number(form_data.role_id),
    full_name: form_data.full_name.trim(),
    email: form_data.email.trim(),
    password: form_data.password,
    status: form_data.status,
  };
}

function build_edit_payload(form_data) {
  const payload = {};

  if (form_data.client_account_id !== '') {
    payload.client_account_id = form_data.client_account_id
      ? Number(form_data.client_account_id)
      : null;
  }

  if (form_data.role_id !== '') {
    payload.role_id = Number(form_data.role_id);
  }

  if (form_data.full_name.trim()) {
    payload.full_name = form_data.full_name.trim();
  }

  if (form_data.email.trim()) {
    payload.email = form_data.email.trim();
  }

  if (form_data.password.trim()) {
    payload.password = form_data.password;
  }

  if (form_data.status) {
    payload.status = form_data.status;
  }

  return payload;
}

function UserCard({ user, on_edit, on_status_change, is_busy }) {
  const role_name = user.role?.name || 'Sin rol';
  const role_code = user.role?.code || 'unknown';
  const status = user.status || 'unknown';

  return (
    <article className="user-card user-card--enhanced user-card--wow user-card--responsive">
      <div className="user-card__top user-card__top--responsive">
        <div className="user-card__identity user-card__identity--responsive">
          <div className="user-card__headline user-card__headline--responsive">
            <div className="user-card__headline-copy user-card__headline-copy--responsive">
              <div className="user-card__title-row user-card__title-row--responsive">
                <span className="user-card__title-icon" aria-hidden="true">
                  <CircleUserRound size={16} />
                </span>
                <h3 className="user-card__name">{user.full_name}</h3>
              </div>

              <p className="user-card__email">{user.email}</p>
            </div>

            <div
              className="user-card__side-metric user-card__side-metric--wow user-card__side-metric--responsive"
              aria-label={`Estado ${status}`}
            >
              <div className="user-card__side-metric-top user-card__side-metric-top--responsive">
                <span className="user-card__side-metric-icon" aria-hidden="true">
                  <Sparkles size={14} />
                </span>
                <span className="user-card__side-metric-label">Estado</span>
              </div>
              <strong className="user-card__side-metric-value">{format_label(status)}</strong>
            </div>
          </div>

          <div className="company-card__badges user-card__badges--wow user-card__badges--responsive">
            <span className={`status-pill status-pill--${status}`}>
              <BadgeCheck size={13} aria-hidden="true" />
              {format_label(status)}
            </span>

            <span className="neutral-pill">
              <ShieldCheck size={13} aria-hidden="true" />
              {role_name}
            </span>

            <span className="neutral-pill">
              <UserCog size={13} aria-hidden="true" />
              {role_code}
            </span>
          </div>
        </div>

        <div className="user-card__actions user-card__actions--responsive">
          <button
            type="button"
            className="secondary-button user-card__edit-button user-card__edit-button--responsive"
            onClick={() => on_edit(user)}
            disabled={is_busy}
          >
            <Pencil size={16} aria-hidden="true" />
            Editar
          </button>
        </div>
      </div>

      <div className="user-card__grid user-card__grid--wow user-card__grid--responsive">
        <div className="user-card__meta-item user-card__meta-item--highlight user-card__meta-item--wow user-card__meta-item--responsive">
          <span className="user-card__meta-label">
            <Users size={13} aria-hidden="true" />
            Cliente asociado
          </span>
          <strong>{user.client_account_id ?? '—'}</strong>
        </div>

        <div className="user-card__meta-item user-card__meta-item--wow user-card__meta-item--responsive">
          <span className="user-card__meta-label">
            <Sparkles size={13} aria-hidden="true" />
            ID usuario
          </span>
          <strong>{user.id}</strong>
        </div>

        <div className="user-card__meta-item user-card__meta-item--wow user-card__meta-item--responsive">
          <span className="user-card__meta-label">
            <BadgeCheck size={13} aria-hidden="true" />
            Último acceso
          </span>
          <strong>{format_datetime(user.last_login_at)}</strong>
        </div>

        <div className="user-card__meta-item user-card__meta-item--wow user-card__meta-item--responsive">
          <span className="user-card__meta-label">
            <BadgeCheck size={13} aria-hidden="true" />
            Creado
          </span>
          <strong>{format_datetime(user.created_at)}</strong>
        </div>

        <div className="user-card__meta-item user-card__meta-item--wow user-card__meta-item--responsive">
          <span className="user-card__meta-label">
            <BadgeCheck size={13} aria-hidden="true" />
            Actualizado
          </span>
          <strong>{format_datetime(user.updated_at)}</strong>
        </div>
      </div>

      <div className="user-status-actions user-status-actions--wow user-status-actions--responsive">
        {status_options.map((next_status) => (
          <button
            key={next_status}
            type="button"
            className={`status-action-button user-status-actions__button user-status-actions__button--responsive ${
              user.status === next_status ? 'status-action-button--active' : ''
            }`}
            onClick={() => on_status_change(user.id, next_status)}
            disabled={is_busy || user.status === next_status}
          >
            {next_status === 'active' ? <BadgeCheck size={15} aria-hidden="true" /> : null}
            {next_status === 'inactive' ? <CircleOff size={15} aria-hidden="true" /> : null}
            {next_status === 'disabled' ? <LockKeyhole size={15} aria-hidden="true" /> : null}
            {format_label(next_status)}
          </button>
        ))}
      </div>
    </article>
  );
}

function UsersPage() {
  const { users, is_loading, error_message, reload_users } = useUsers();

  const [is_create_open, setIsCreateOpen] = useState(false);
  const [editing_user, setEditingUser] = useState(null);

  const [create_form, setCreateForm] = useState(initial_create_form);
  const [edit_form, setEditForm] = useState(initial_edit_form);

  const [action_error, setActionError] = useState('');
  const [action_success, setActionSuccess] = useState('');
  const [is_action_busy, setIsActionBusy] = useState(false);

  const active_users_count = useMemo(
    () => users.filter((user) => user.status === 'active').length,
    [users]
  );

  const roles_count = useMemo(
    () => new Set(users.map((user) => user.role?.code).filter(Boolean)).size,
    [users]
  );

  function clear_messages() {
    setActionError('');
    setActionSuccess('');
  }

  function open_create_modal() {
    clear_messages();
    setCreateForm(initial_create_form);
    setIsCreateOpen(true);
  }

  function close_create_modal() {
    setIsCreateOpen(false);
  }

  function open_edit_modal(user) {
    clear_messages();
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || '',
      email: user.email || '',
      password: '',
      role_id: user.role?.id ? String(user.role.id) : '',
      status: user.status || '',
      client_account_id:
        user.client_account_id === null || user.client_account_id === undefined
          ? ''
          : String(user.client_account_id),
    });
  }

  function close_edit_modal() {
    setEditingUser(null);
  }

  function handle_create_change(event) {
    const { name, value } = event.target;
    clear_messages();
    setCreateForm((previous) => ({ ...previous, [name]: value }));
  }

  function handle_edit_change(event) {
    const { name, value } = event.target;
    clear_messages();
    setEditForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handle_create_submit(event) {
    event.preventDefault();
    clear_messages();

    if (!create_form.full_name.trim() || !create_form.email.trim() || !create_form.password.trim()) {
      setActionError('Debes completar nombre, email y contraseña.');
      return;
    }

    setIsActionBusy(true);

    const response = await create_user(build_create_payload(create_form));

    if (!response.ok) {
      setActionError(response.error?.message || 'No se pudo crear el usuario.');
      setIsActionBusy(false);
      return;
    }

    setActionSuccess('Usuario creado correctamente.');
    setIsCreateOpen(false);
    await reload_users();
    setIsActionBusy(false);
  }

  async function handle_edit_submit(event) {
    event.preventDefault();
    clear_messages();

    if (!editing_user) return;

    const payload = build_edit_payload(edit_form);

    if (Object.keys(payload).length === 0) {
      setActionError('Debes cambiar al menos un campo para actualizar.');
      return;
    }

    setIsActionBusy(true);

    const response = await update_user(editing_user.id, payload);

    if (!response.ok) {
      setActionError(response.error?.message || 'No se pudo actualizar el usuario.');
      setIsActionBusy(false);
      return;
    }

    setActionSuccess('Usuario actualizado correctamente.');
    setEditingUser(null);
    await reload_users();
    setIsActionBusy(false);
  }

  async function handle_status_change(user_id, next_status) {
    clear_messages();
    setIsActionBusy(true);

    const response = await update_user_status(user_id, { status: next_status });

    if (!response.ok) {
      setActionError(response.error?.message || 'No se pudo actualizar el estado.');
      setIsActionBusy(false);
      return;
    }

    setActionSuccess(`Estado actualizado a ${format_label(next_status)}.`);
    await reload_users();
    setIsActionBusy(false);
  }

  if (is_loading) {
    return (
      <section className="page-section users-page users-page--responsive">
        <StatusCard
          title="Cargando usuarios internos"
          message="Estamos consultando el listado real de usuarios desde la API."
          variant="loading"
        />
      </section>
    );
  }

  if (error_message) {
    return (
      <section className="page-section users-page users-page--responsive">
        <StatusCard
          title="No se pudo cargar el listado de usuarios"
          message={error_message}
          variant="error"
          action_label="Reintentar"
          on_action={reload_users}
        />
      </section>
    );
  }

  return (
    <section className="page-section users-page users-page--responsive">
      <div className="dashboard-header users-page__hero users-page__hero--enhanced users-page__hero--responsive">
        <div className="users-page__hero-copy users-page__hero-copy--responsive">
          <span className="section-chip users-page__hero-chip users-page__hero-chip--responsive">
            <Users size={14} aria-hidden="true" />
            <span>Usuarios internos</span>
          </span>
          <h1 className="page-title">Gestión básica de usuarios</h1>
          <p className="page-description">
            Vista conectada a <strong>GET /users</strong>, <strong>POST /users</strong>,{' '}
            <strong>PATCH /users/:id</strong> y <strong>PATCH /users/:id/status</strong>.
          </p>

          <div className="company-card__badges users-page__hero-badges users-page__hero-badges--responsive">
            <span className="neutral-pill">
              <UserCog size={13} aria-hidden="true" />
              Gestión interna
            </span>
            <span className="neutral-pill">
              <BadgeCheck size={13} aria-hidden="true" />
              Estados operativos
            </span>
            <span className="neutral-pill">
              <ShieldCheck size={13} aria-hidden="true" />
              Roles activos
            </span>
          </div>
        </div>

        <div className="detail-header__actions users-page__actions users-page__actions--responsive">
          <button
            type="button"
            className="secondary-button users-page__action-secondary users-page__action-secondary--responsive"
            onClick={open_create_modal}
          >
            <Plus size={16} aria-hidden="true" />
            Nuevo usuario
          </button>

          <button
            type="button"
            className="button-primary users-page__action-primary users-page__action-primary--responsive"
            onClick={reload_users}
          >
            <RefreshCcw size={16} aria-hidden="true" />
            Actualizar
          </button>
        </div>
      </div>

      {action_success ? (
        <div className="form-feedback form-feedback--success users-page__feedback" aria-live="polite">
          {action_success}
        </div>
      ) : null}

      {action_error ? (
        <div className="form-feedback form-feedback--error users-page__feedback" aria-live="polite">
          {action_error}
        </div>
      ) : null}

      <div className="list-toolbar list-toolbar--enhanced users-page__stats users-page__stats--wow users-page__stats--responsive">
        <div className="toolbar-stat toolbar-stat--featured users-page__stat users-page__stat--featured users-page__stat--responsive">
          <span className="toolbar-stat__label">
            <Users size={13} aria-hidden="true" />
            Usuarios
          </span>
          <strong className="toolbar-stat__value">{users.length}</strong>
        </div>

        <div className="toolbar-stat users-page__stat users-page__stat--responsive">
          <span className="toolbar-stat__label">
            <BadgeCheck size={13} aria-hidden="true" />
            Activos
          </span>
          <strong className="toolbar-stat__value">{active_users_count}</strong>
        </div>

        <div className="toolbar-stat users-page__stat users-page__stat--responsive">
          <span className="toolbar-stat__label">
            <ShieldCheck size={13} aria-hidden="true" />
            Roles detectados
          </span>
          <strong className="toolbar-stat__value">{roles_count}</strong>
        </div>
      </div>

      {users.length === 0 ? (
        <StatusCard
          title="No hay usuarios disponibles"
          message="La API respondió correctamente, pero no hay usuarios para mostrar."
          variant="empty"
        />
      ) : (
        <div className="user-list users-page__list users-page__list--responsive">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              on_edit={open_edit_modal}
              on_status_change={handle_status_change}
              is_busy={is_action_busy}
            />
          ))}
        </div>
      )}

      {is_create_open ? (
        <div className="modal-overlay modal-overlay--responsive">
          <div className="modal-card users-page__modal-card users-page__modal-card--wow users-page__modal-card--responsive">
            <div className="dashboard-panel__header users-page__modal-header users-page__modal-header--responsive">
              <span className="section-chip users-page__modal-chip users-page__modal-chip--responsive">
                <Plus size={14} aria-hidden="true" />
                <span>Alta</span>
              </span>
              <h2 className="dashboard-panel__title">Nuevo usuario</h2>
              <p className="dashboard-panel__subtitle">
                Alta real conectada a <strong>POST /users</strong>.
              </p>
            </div>

            <form className="public-form users-page__modal-form users-page__modal-form--responsive" onSubmit={handle_create_submit}>
              <div className="public-form-grid public-form-grid--responsive">
                <div className="form-field">
                  <label className="form-label" htmlFor="create_full_name">Nombre completo</label>
                  <input
                    id="create_full_name"
                    name="full_name"
                    className="form-input"
                    value={create_form.full_name}
                    onChange={handle_create_change}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="create_email">Email</label>
                  <input
                    id="create_email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={create_form.email}
                    onChange={handle_create_change}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="create_password">Contraseña</label>
                  <input
                    id="create_password"
                    name="password"
                    type="password"
                    className="form-input"
                    value={create_form.password}
                    onChange={handle_create_change}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="create_role_id">Rol</label>
                  <select
                    id="create_role_id"
                    name="role_id"
                    className="form-input"
                    value={create_form.role_id}
                    onChange={handle_create_change}
                  >
                    {role_options.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="create_status">Estado</label>
                  <select
                    id="create_status"
                    name="status"
                    className="form-input"
                    value={create_form.status}
                    onChange={handle_create_change}
                  >
                    {status_options.map((status) => (
                      <option key={status} value={status}>
                        {format_label(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="create_client_account_id">Client account ID</label>
                  <input
                    id="create_client_account_id"
                    name="client_account_id"
                    className="form-input"
                    value={create_form.client_account_id}
                    onChange={handle_create_change}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="modal-actions modal-actions--responsive">
                <button
                  type="button"
                  className="secondary-button users-page__modal-action users-page__modal-action--responsive"
                  onClick={close_create_modal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button-primary users-page__modal-action users-page__modal-action--responsive"
                  disabled={is_action_busy}
                >
                  {is_action_busy ? 'Guardando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {editing_user ? (
        <div className="modal-overlay modal-overlay--responsive">
          <div className="modal-card users-page__modal-card users-page__modal-card--wow users-page__modal-card--responsive">
            <div className="dashboard-panel__header users-page__modal-header users-page__modal-header--responsive">
              <span className="section-chip users-page__modal-chip users-page__modal-chip--responsive">
                <Pencil size={14} aria-hidden="true" />
                <span>Edición</span>
              </span>
              <h2 className="dashboard-panel__title">Editar usuario</h2>
              <p className="dashboard-panel__subtitle">
                Actualización real conectada a <strong>PATCH /users/:id</strong>.
              </p>
            </div>

            <form className="public-form users-page__modal-form users-page__modal-form--responsive" onSubmit={handle_edit_submit}>
              <div className="public-form-grid public-form-grid--responsive">
                <div className="form-field">
                  <label className="form-label" htmlFor="edit_full_name">Nombre completo</label>
                  <input
                    id="edit_full_name"
                    name="full_name"
                    className="form-input"
                    value={edit_form.full_name}
                    onChange={handle_edit_change}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit_email">Email</label>
                  <input
                    id="edit_email"
                    name="email"
                    type="email"
                    className="form-input"
                    value={edit_form.email}
                    onChange={handle_edit_change}
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit_password">Nueva contraseña</label>
                  <input
                    id="edit_password"
                    name="password"
                    type="password"
                    className="form-input"
                    value={edit_form.password}
                    onChange={handle_edit_change}
                    placeholder="Déjalo vacío para no cambiarla"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit_role_id">Rol</label>
                  <select
                    id="edit_role_id"
                    name="role_id"
                    className="form-input"
                    value={edit_form.role_id}
                    onChange={handle_edit_change}
                  >
                    <option value="">Sin cambio</option>
                    {role_options.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit_status">Estado</label>
                  <select
                    id="edit_status"
                    name="status"
                    className="form-input"
                    value={edit_form.status}
                    onChange={handle_edit_change}
                  >
                    <option value="">Sin cambio</option>
                    {status_options.map((status) => (
                      <option key={status} value={status}>
                        {format_label(status)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="edit_client_account_id">Client account ID</label>
                  <input
                    id="edit_client_account_id"
                    name="client_account_id"
                    className="form-input"
                    value={edit_form.client_account_id}
                    onChange={handle_edit_change}
                    placeholder="Vacío para null o sin cambio si no lo tocas"
                  />
                </div>
              </div>

              <div className="modal-actions modal-actions--responsive">
                <button
                  type="button"
                  className="secondary-button users-page__modal-action users-page__modal-action--responsive"
                  onClick={close_edit_modal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button-primary users-page__modal-action users-page__modal-action--responsive"
                  disabled={is_action_busy}
                >
                  {is_action_busy ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default UsersPage;