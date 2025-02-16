import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useAppSelector } from '@store/app/hooks';
import { selectConnectionStatus } from '@store/selectors/sourceSelectors';
import { ButtonGroup, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from 'react';
import { useDashboard } from '@/dashboard';
import FileMenu from './FileMenu';
import { selectWebMode } from '@/store/slices/appSlice';

function Titlebar() {
  const dashboard = useDashboard();
  const connectionStatuses = useAppSelector(selectConnectionStatus);
  const webMode = useAppSelector(selectWebMode);

  const [dashboardTitle, setDashboardTitle] = useState(dashboard.getTitle());

  useEffect(() => {
    dashboard.on('dashboardTitleChange', (title) => {
      setDashboardTitle(title);
    });
  }, [dashboard]);

  return (
    <div
      className="fwc-titlebar"
      data-tauri-drag-region
      style={{
        height: '33px',
        background: 'black',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        // padding: "0 7px",
        justifyContent: 'space-between',
        padding: webMode ? '0 10px' : 0,
      }}
    >
      {!webMode && <FileMenu />}
      <div
        style={{
          fontSize: 18,
          color: '#ccc',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {dashboardTitle}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <div>
          {Object.values(connectionStatuses).map((status) => {
            return (
              <div
                key={`title-item-${status.label}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: status.connected ? 'green' : 'red',
                  gap: '5px',
                  fontSize: '15px',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {status.connected ? (
                  <WifiIcon fontSize="small" />
                ) : (
                  <WifiOffIcon fontSize="small" />
                )}
                {status.label}
              </div>
            );
          })}
        </div>
        {!webMode && (
          <ButtonGroup variant="outlined" aria-label="Loading button group">
            <IconButton
              aria-label="Minimize"
              style={{
                outline: 'none',
              }}
              onClick={() => {
                dashboard.emit('minimizeWindowClickEvent');
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Maximize"
              style={{
                outline: 'none',
              }}
              onClick={() => {
                dashboard.emit('maximizeWindowClickEvent');
              }}
            >
              <CropSquareIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton
              aria-label="Close"
              style={{
                outline: 'none',
              }}
              onClick={() => {
                dashboard.emit('closeWindowClickEvent');
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}

export default Titlebar;
