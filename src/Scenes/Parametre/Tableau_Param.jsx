
import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { FilterListOutlined } from "@mui/icons-material";
import {   Select, MenuItem, TextField , InputAdornment } from "@mui/material";
import { useState } from "react";
import { SearchOutlined } from "@mui/icons-material";
import Button from '@mui/material/Button';
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";


const PlusIcon = createSvgIcon(
  // credit: plus icon from https://heroicons.com
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>,
  'Plus',
);

import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import DeleteUserDialog from './DeleteUserDialog';



function createData(id, nom, role, telephone, statut) {
  return { id, nom, role, telephone, statut };
}



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'nom',
    numeric: false,
    disablePadding: true,
    label: 'Nom',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'telephone',
    numeric: false,
    disablePadding: false,
    label: 'Téléphone',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
  
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: { 'aria-label': 'select all desserts' },
            }}
            />
            </TableCell> 
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            color: 'inherit',
            flex: '1 1 100%',
          }}
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h3"
          id="tableTitle"
          component="div"
        >
         <PeopleOutlined/> Utilisateurs
         
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Tableau_Carburant({ refreshKey }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setOpen] = useState(false); // Dialogue fermeture
    const [rows, setRows] = useState([]);
    const fetchUsers = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
         console.log('data reçu:', data) // AJOUTÉ
        const formatted = data.map(u => createData(
          u.id, u.nom, u.role, u.telephone, u.statut
        ))
        setRows(formatted)
      })
      .catch(err => console.error('Erreur:', err))
  }

  React.useEffect(() => {
    fetchUsers()
  }, [refreshKey])
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;



  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );


  // Dialog
  const [openEdit, setOpenEdit] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);


// Fonction suppression
const handleDelete = async (user) => {
  if (!window.confirm('Supprimer cet utilisateur ?')) return
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
      method: 'DELETE'
    })
    setRows(rows.filter(row => row.id !== user.id))
  } catch (error) {
    console.error('Erreur:', error)
  }
}

  
  return (
    
    <Box sx={{ width: '100%' , mt:7}}>

        {/* Filtre */}

        

        {/* Tableau */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              // numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    // onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    // selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        // checked={isItemSelected}
                        slotProps={{
                          input: { 'aria-labelledby': labelId },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.nom}
                    </TableCell>
                    <TableCell align="right">{row.role}</TableCell>
                    <TableCell align="right">{row.telephone}</TableCell>
                    <TableCell align="right">
                        <Box
                            sx={{
                            display: "inline-block",
                            px: 1.5,
                            py: 0.3,
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor: row.statut.toLowerCase() === "actif" ? "#4cceac20" : "#f0a50020",
                            color: row.statut.toLowerCase() === "actif" ? "#4cceac" : "#f0a500",
                            }}
                        >
                           
                            {row.statut === "actif" ? "Actif" : "Inactif"}
                        </Box>
                    </TableCell>
                    {/* Action */}
                    <TableCell align="right">
                    <IconButton onClick={() => { setSelectedUser(row); setOpenEdit(true); }} size="small" sx={{ color: "#4cceac" }}>
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <EditUserDialog
                      open={openEdit}
                      onClose={() => setOpenEdit(false)}
                      user={selectedUser}
                      onRefresh={fetchUsers}
                    />
                    <IconButton  onClick={() => handleDelete(row)}  size="small" sx={{ color: "#db4f4a" }}>
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </TableCell>
                    
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
        
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Affichage compact"
      /> <br /> <br />

      {/* Ajouter USER */}
      
      <Button onClick={() => setOpen(true)}
                              component="label"
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              startIcon={<PlusIcon />}
                            >
                              Ajouter un Utilisateur
      </Button>
      <AddUserDialog 
        open={open} 
        onClose={() => setOpen(false)}
        onRefresh={fetchUsers}
      />
    </Box>
  );
}
