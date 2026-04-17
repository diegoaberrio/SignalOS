import {
  AlertTriangle,
  Info,
  LoaderCircle,
  SearchX,
} from 'lucide-react';

function StatusCard({
  title,
  message,
  variant = 'default',
  action_label,
  on_action,
}) {
  const has_action = Boolean(action_label && on_action);

  const eyebrow =
    variant === 'loading'
      ? 'Cargando'
      : variant === 'error'
        ? 'Error'
        : variant === 'empty'
          ? 'Sin resultados'
          : 'Información';

  const Icon =
    variant === 'loading'
      ? LoaderCircle
      : variant === 'error'
        ? AlertTriangle
        : variant === 'empty'
          ? SearchX
          : Info;

  return (
    <div
      className={`status-card status-card--${variant} status-card--responsive ${
        has_action ? 'status-card--actionable' : ''
      }`}
    >
      <div className="status-card__content status-card__content--responsive">
        <div className="status-card__top status-card__top--responsive">
          <span className="status-card__icon" aria-hidden="true">
            <Icon
              size={18}
              className={variant === 'loading' ? 'status-card__icon-spin' : ''}
            />
          </span>

          <span className="status-card__eyebrow status-card__eyebrow--responsive">
            {eyebrow}
          </span>
        </div>

        <h3 className="status-card__title">{title}</h3>
        <p className="status-card__message">{message}</p>
      </div>

      {has_action ? (
        <div className="status-card__actions status-card__actions--responsive">
          <button
            type="button"
            className="button-primary status-card__button status-card__button--responsive"
            onClick={on_action}
          >
            {action_label}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default StatusCard;