import React from "react";
import PropTypes from "prop-types";

export function TrelloMark({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="6" fill="#026AA7" />
      <rect x="6" y="5" width="6.5" height="12.5" rx="2" fill="#E4F0F6" />
      <rect x="14" y="5" width="5.8" height="9.5" rx="2" fill="#6CC3FF" />
    </svg>
  );
}

TrelloMark.propTypes = {
  className: PropTypes.string,
};

TrelloMark.defaultProps = {
  className: "h-6 w-6",
};

export function PlusIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path
        d="M12 5v14m7-7H5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

PlusIcon.propTypes = {
  className: PropTypes.string,
};

PlusIcon.defaultProps = {
  className: "h-5 w-5",
};

export function ListIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path
        d="M9 6h10M5 6h.01M9 12h10M5 12h.01M9 18h10M5 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

ListIcon.propTypes = {
  className: PropTypes.string,
};

ListIcon.defaultProps = {
  className: "h-5 w-5",
};

export function TemplateIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path
        d="M6 4h8l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 4v3.5a.5.5 0 0 0 .5.5H18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 13H15M8.5 16H15M8.5 10H12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

TemplateIcon.propTypes = {
  className: PropTypes.string,
};

TemplateIcon.defaultProps = {
  className: "h-5 w-5",
};

export function CogIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <path
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.607 2.296.07 2.572-1.065Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

CogIcon.propTypes = {
  className: PropTypes.string,
};

CogIcon.defaultProps = {
  className: "h-5 w-5",
};

export function CheckFileIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        d="m17 21l-2.75-3l1.16-1.16L17 18.43l3.59-3.59l1.16 1.41M12.8 21H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h14a2 2 0 0 1 2 2v7.8c-.88-.51-1.91-.8-3-.8l-1 .08V11H7v2h7.69A5.98 5.98 0 0 0 12 18c0 1.09.29 2.12.8 3m-.8-6H7v2h5m5-10H7v2h10"
      />
    </svg>
  );
}

CheckFileIcon.propTypes = {
  className: PropTypes.string,
};

CheckFileIcon.defaultProps = {
  className: "h-5 w-5",
};

export function RefreshIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </g>
    </svg>
  );
}

RefreshIcon.propTypes = {
  className: PropTypes.string,
};

RefreshIcon.defaultProps = {
  className: "h-5 w-5",
};

export function CheckTopicsIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        d="M4 21q-.825 0-1.412-.587T2 19V5q0-.825.588-1.412T4 3h16q.825 0 1.413.588T22 5v14q0 .825-.587 1.413T20 21zm5-4q.425 0 .713-.288T10 16t-.288-.712T9 15H6q-.425 0-.712.288T5 16t.288.713T6 17zm5.55-4.825l-.725-.725q-.3-.3-.7-.287t-.7.312q-.275.3-.288.7t.288.7L13.85 14.3q.3.3.7.3t.7-.3l3.55-3.55q.3-.3.3-.7t-.3-.7t-.712-.3t-.713.3zM9 13q.425 0 .713-.288T10 12t-.288-.712T9 11H6q-.425 0-.712.288T5 12t.288.713T6 13zm0-4q.425 0 .713-.288T10 8t-.288-.712T9 7H6q-.425 0-.712.288T5 8t.288.713T6 9z"
      />
    </svg>
  );
}

CheckTopicsIcon.propTypes = {
  className: PropTypes.string,
};

CheckTopicsIcon.defaultProps = {
  className: "h-5 w-5",
};

export function CheckIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill="currentColor"
        d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
      />
    </svg>
  );
}

CheckIcon.propTypes = {
  className: PropTypes.string,
};

CheckIcon.defaultProps = {
  className: "h-5 w-5",
};
