import { Link } from 'react-router-dom';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * Breadcrumb component.
 *
 * @param {Array<{ label: string, to?: string }>} crumbs - Array of breadcrumb items.
 *   The last item is treated as the current (non-linked) page.
 */
const Breadcrumb = ({ crumbs = [] }) => {
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <img
                  src={chevronRightIcon}
                  alt=""
                  className="w-3 h-3 text-gray-400"
                />
              )}
              {isLast || !crumb.to ? (
                <span
                  className={isLast ? 'text-gray-900 font-medium' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
