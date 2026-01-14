'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { pendingText?: string }
) {
  const { pending } = useFormStatus();
  const { children, pendingText = 'Procesando…', ...rest } = props;
  return (
    <button
      {...rest}
      disabled={pending || rest.disabled}
      className="inline-flex items-center px-4 py-2 rounded border"
    >
      {pending ? pendingText : children}
    </button>
  );
}
