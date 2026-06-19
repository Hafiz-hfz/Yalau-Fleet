import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import { VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";

// filtre

import { FilterListOutlined } from "@mui/icons-material";
import {   Select, MenuItem, TextField , InputAdornment } from "@mui/material";
import { useState } from "react";
import { SearchOutlined } from "@mui/icons-material";
import Button from '@mui/material/Button';

// Edit et View Champs

import EditChauffeurDialog from './EditChaufeurDialog';
import ViewChauffeurDialog from './ViewChaufeurDialog';
import DeleteChauffeurDialog from './DeleteChauffeurDialog';



function createData(id,nom,telephone, num_permis, camion_affecte,statut,action,camionId ) {
  return {
    id,
    nom,
    telephone,
    num_permis,
    camion_affecte,
    statut,
    action,
    camionId 
  };
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
    id: 'telephone',
    numeric: true,
    disablePadding: false,
    label: 'Téléphone',
  },
   {
    id: 'num_permis',
    numeric: true,
    disablePadding: false,
    label: 'Numéro de permis',
  },
  {
    id: 'camion_affecte',
    numeric: true,
    disablePadding: false,
    label: 'Véhicule Affecté',
  },
  {
    id: 'statut',
    numeric: true,
    disablePadding: false,
    label: 'Statut',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  }
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
            // checked={rowCount > 0 && numSelected === rowCount}
            // onChange={onSelectAllClick}
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
          <PeopleOutlined/> Chauffeurs
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

export default function Tableau_Chauf({ refreshKey }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
   const [rows, setRows] = useState([]);           // AJOUTÉ

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


    //Afichage table et chargement 

     const fetchChauffeurs = () => {
    fetch('${import.meta.env.VITE_API_URL}/api/chauffeurs')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(c => createData(
          c.id,
          c.nom,
          c.telephone,
          c.numeroPermis,
          c.camion ? c.camion.immatriculation : '—',  // immatriculation du camion lié
          c.statut,
          null,
          c.camionId
        ))
         console.log('rows:', formatted)
        setRows(formatted)
      })
      .catch(err => console.error('Erreur:', err))
  }

  React.useEffect(() => {
    fetchChauffeurs()
  }, [refreshKey])


  // supprimer chauffeur
  const handleDelete = async (chauffeur) => {
  if (!window.confirm('Supprimer ce chauffeur ?')) return
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/chauffeurs/${chauffeur.id}`, {
      method: 'DELETE'
    })
    setRows(rows.filter(row => row.id !== chauffeur.id))
  } catch (error) {
    console.error('Erreur:', error)
  }
}

    // Tris
    const [statut, setStatut] = useState("");
    const [date, setDate] = useState("");
   const [search, setSearch] = useState("");
    const filteredRows = rows.filter((row) => {
  const matchSearch = (row.nom || "").toLowerCase().includes(search.toLowerCase());
  const matchStatut = statut === "" || (row.statut || "").toLowerCase() === statut.toLowerCase();
  return matchSearch && matchStatut;
});
  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );


  // Style couleur Statut
   const getStatutStyle = (statut) => {
  switch (statut.toLowerCase()) {
    case "disponible":
      return { bg: "#4cceac20", color: "#4cceac", label: "Disponible" };
    case "en mission":
      return { bg: "#f0a50020", color: "#f0a500", label: "En mission" };
    default:
      return { bg: "#66666620", color: "#666666", label: statut };
  }
};

// Trie


// vue et affichage et delete
const [openEdit, setOpenEdit] = useState(false); // Edit
const [selectedChauffeur, setSelectedChauffeur] = useState(null);
const [openView, setOpenView] = useState(false); // View
const [openDelete, setOpenDelete] = useState(false); //Delete


  
  return (

    <Box sx={{ width: '100%' , mt:7}}>
      {/* Filtres */}

      <Box display="flex" sx={{mb:5}} alignItems="center" gap={1.5}>
      
                      {/* Label */}
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                          <FilterListOutlined fontSize="small" />
                          <Typography variant="body1">Filtrer par :</Typography>
                      </Box>
      
                      {/* Tri par statut */}
                      <Select size="small" value={statut} onChange={(e) => setStatut(e.target.value)} displayEmpty>
                          <MenuItem value="">Statut</MenuItem>
                          <MenuItem value="disponible"> Disponible</MenuItem>
                          <MenuItem value="en_mission"> En mission</MenuItem>
                      </Select>
      
                      {/* Date */}
                      
                      
      
                          {/* Recherche */}
                      <TextField
                      size="small"
                      placeholder="Rechercher un Chauffeur..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                          startAdornment: (
                          <InputAdornment position="start">
                              <SearchOutlined fontSize="small" />
                          </InputAdornment>
                          ),
                      }}
                      />
      
                      </Box>

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
              numSelected={selected.length}
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
                    // role="checkbox"
                    // aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
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
                    <TableCell align="right">{row.telephone}</TableCell>
                    <TableCell align="right">{row.num_permis}</TableCell>
                    <TableCell align="right">{row.camion_affecte}</TableCell>
                                    {/* Statut */}
                    <TableCell align="right">
                      <Box sx={{
                        display: "inline-block",
                        px: 1.5, py: 0.3,
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: getStatutStyle(row.statut).bg,
                        color: getStatutStyle(row.statut).color,
                      }}>
                          {getStatutStyle(row.statut).label}
                      </Box>
                    </TableCell>
                                    {/* Action */}
                    <TableCell align="right">
                    {/* Vue */}
                    <IconButton  onClick={() => { setSelectedChauffeur(row); setOpenView(true); }}
                      size="small" sx={{ color: "#fff" }}>
                      <VisibilityOutlined fontSize="small" />
                    </IconButton>
                    <ViewChauffeurDialog
                      open={openView}
                      onClose={() => setOpenView(false)}
                      chauffeur={selectedChauffeur}
                    />
                    {/* Modifier */}
                    <IconButton  onClick={() => { setSelectedChauffeur(row); setOpenEdit(true); }}
                     size="small" sx={{ color: "#fff" }}>
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <EditChauffeurDialog
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    chauffeur={selectedChauffeur}
                      onRefresh={fetchChauffeurs} 
                  />
                    {/* Suprimer */}
                    <IconButton  onClick={() => handleDelete(row)}
                      size="small" sx={{ color: "#db4f4a" }}>
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                    <DeleteChauffeurDialog
                      open={openDelete}
                      onClose={() => setOpenDelete(false)}
                      chauffeur={selectedChauffeur}
                      onConfirm={handleDelete}
                    />
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
        label="Dense padding"
      />
    </Box>
  );
}
