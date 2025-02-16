import { Button, Divider, Menu, MenuItem, MenuList } from '@mui/material';
import { MouseEvent, useEffect, useState } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import { useDashboard } from '@/dashboard';
import PluginsDialog from './PluginsDialog';
import { NestedMenuItem } from 'mui-nested-menu';
import { Layout } from '@store/slices/layoutSlice';
import styles from './Titlebar.module.scss';

function FileMenu() {
  const dashboard = useDashboard();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [pluginsDialogOpen, setPluginsDialogOpen] = useState(false);
  const [exampleDashboards, setExampleDashboards] = useState<
    {
      name: string;
      layout: Layout;
    }[]
  >([]);

  useEffect(() => {
    dashboard.on('exampleAdd', () => {
      setExampleDashboards(dashboard.getExamples());
    });
    setExampleDashboards(dashboard.getExamples());
  }, [dashboard]);

  return (
    <>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ color: 'white', outline: 'none' }}
          style={{
            outline: 'none',
            textTransform: 'none',
          }}
          startIcon={<ArticleIcon fontSize="small" />}
        >
          File
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          style={{
            outline: 'none',
          }}
        >
          <MenuList
            dense
            style={{
              padding: 0,
            }}
          >
            <MenuItem
              onClick={() => {
                dashboard.emit('newDashboardMenuClickEvent');
                handleClose();
              }}
            >
              New Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                dashboard.emit('newWindowMenuClickEvent');
                handleClose();
              }}
            >
              New Window
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                dashboard.emit('openDashboardMenuClickEvent');
                handleClose();
              }}
            >
              Open Dashboard...
            </MenuItem>
            <NestedMenuItem
              className={styles['open-example']}
              label="Open Example..."
              parentMenuOpen={open}
              disabled={exampleDashboards.length === 0}
            >
              <MenuList
                dense
                style={{
                  padding: 0,
                }}
              >
                {exampleDashboards.map((example) => {
                  return (
                    <MenuItem
                      onClick={() => {
                        dashboard.setLayout(example.layout);
                        dashboard.setTitle(example.name);
                        handleClose();
                      }}
                      key={example.name}
                    >
                      {example.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </NestedMenuItem>

            <Divider
              style={{
                marginTop: '8px',
                marginBottom: '8px',
              }}
            />

            <MenuItem
              onClick={() => {
                dashboard.emit('saveDashboardMenuClickEvent');
                handleClose();
              }}
            >
              Save Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                dashboard.emit('saveDashboardAsMenuClickEvent');
                handleClose();
              }}
            >
              Save Dashboard As...
            </MenuItem>
            <MenuItem
              onClick={() => {
                dashboard.emit('exportForWebClickEvent');
                handleClose();
              }}
            >
              Export for Web...
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                dashboard.emit('pluginsMenuClickEvent');
                setPluginsDialogOpen(true);
                handleClose();
              }}
            >
              Plugins
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                dashboard.emit('closeWindowMenuClickEvent');
                handleClose();
              }}
            >
              Close Window
            </MenuItem>
            <MenuItem
              onClick={() => {
                dashboard.emit('quitMenuClickEvent');
                handleClose();
              }}
            >
              Quit
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <PluginsDialog
        open={pluginsDialogOpen}
        onClose={() => setPluginsDialogOpen(false)}
      />
    </>
  );
}

export default FileMenu;
