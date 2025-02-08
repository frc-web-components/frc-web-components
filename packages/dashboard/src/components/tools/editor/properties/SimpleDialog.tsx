import { ReactNode } from 'react';
import Draggable from 'react-draggable';
import './SimpleDialog.css'; // Assuming you have a CSS file for styling

interface Props {
  children: ReactNode;
  title: string;
  buttons?: {
    label: string;
    action: () => unknown;
  }[];
  isOpen: boolean;
  onClose?: () => unknown;
}

const SimpleDialog = ({
  children,
  title,
  buttons = [],
  isOpen,
  onClose,
}: Props) => {
  return (
    <>
      {/* <button onClick={openDialog}>Open Dialog</button> */}
      {isOpen && (
        <Draggable handle=".dialog-header">
          <div className="dialog">
            <div className="dialog-header">
              <span>{title}</span>
            </div>
            <div className="dialog-content">{children}</div>
            <div className="dialog-actions">
              <button onClick={onClose}>Close</button>
              {buttons.map((button) => (
                <button
                  key={button.label}
                  className="primary"
                  onClick={button.action}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default SimpleDialog;
