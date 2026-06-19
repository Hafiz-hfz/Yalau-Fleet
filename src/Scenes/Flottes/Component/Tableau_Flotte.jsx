import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from "react";

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
import { FilterListOutlined } from "@mui/icons-material";
import {   Select, MenuItem, TextField , InputAdornment } from "@mui/material";

import { SearchOutlined } from "@mui/icons-material";
import ViewVehiculeDialog from './ViewVehiculeDialog';
import EditVehiculeDialog from './EditVehiculeDialog';


function createData(id,immatriculation,marque_modele,capacite,chauffeur_assigne,statut,dernierPosition,action) {
  return {
    id,
    immatriculation,
    marque_modele,
    capacite,
    chauffeur_assigne,
    statut,
    dernierPosition,
    action
  };
}

// const rows = [
//   createData('BJ-8754',  '4x4', 52, 'BIAOU', "Actif", 'Parakou'),
//   createData('BJ-8785',  'Lenovo', 120, 'KOKOU', 'En maintenance', 'Calavi'),
//   createData('BJ-5754',  'Hitler', 300, 'BIOVI', 'En pause', 'Avotrou'),
// ];




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
    id: 'immatriculation',
    numeric: false,
    disablePadding: true,
    label: 'Immatriculation',
  },
  {
    id: 'marque_model',
    numeric: true,
    disablePadding: false,
    label: 'Marque/Model',
  },
  {
    id: 'capacite',
    numeric: true,
    disablePadding: false,
    label: 'Capacité (tonnes)',
  },
  {
    id: 'chaffeur_assigne',
    numeric: true,
    disablePadding: false,
    label: 'Chaffeur assigné',
  },
  {
    id: 'statut',
    numeric: true,
    disablePadding: false,
    label: 'Statut',
  },
  {
    id: 'dernierPosition',
    numeric: true,
    disablePadding: false,
    label: 'Dernière Position',
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
          Flottes
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

export default function Tableau_Flotte({ refreshKey }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //Vue et modification de vehicule
const [openView, setOpenView] = useState(false);
const [selectedVehicule, setSelectedVehicule] = useState(null); // View vehicule
const [openEdit, setOpenEdit] = useState(false);
const [statut, setStatut] = useState("");
const [date, setDate] = useState("");
const [search, setSearch] = useState("");
  // AJOUTÉ : état pour stocker les camions de la base
const [rows, setRows] = useState([]);

//fetch dans une fonction réutilisable
const fetchCamions = () => {
  fetch('${import.meta.env.VITE_API_URL}/api/camions')
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(camion => createData(
        camion.id,
        camion.immatriculation,
        camion.marque,
        camion.capaciteCharges,
        camion.chauffeurs[0]?.nom || '—',  // MODIFIÉ
        camion.statut,
        '',
        null
      ))
      setRows(formatted)
    })
    .catch(err => console.error('Erreur chargement camions:', err))
}

//  appelle la fonction
React.useEffect(() => {
  fetchCamions()
}, [refreshKey])




// supprime un camion
const handleDelete = async (id) => {
  if (!window.confirm('Supprimer ce véhicule ?')) return
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/camions/${id}`, {
      method: 'DELETE'
    })
    // retire le camion de l'affichage sans recharger
    setRows(rows.filter(row => row.id !== id))
  } catch (error) {
    console.error('Erreur:', error)
  }
}


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


    // Filtre et tris 

    
    const filteredRows = rows.filter((row) => {
    const matchSearch = 
    (row.immatriculation || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.marque_modele || "").toLowerCase().includes(search.toLowerCase());
  
  const matchStatut = statut === "" || row.statut.toLowerCase() === statut.toLowerCase();

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
    case "en_panne":
      return { bg: "#f0a50020", color: "#db4f4a", label: "En panne" };
    case "en_route":
      return { bg: "#f0a50020", color: "#685120", label: "En route" };
    default:
      return { bg: "#66666620", color: "#666666", label: statut };
  }
};


/* Données Base de donnees */




  return (
    <Box sx={{ width: '100%' , mt:7}}>

      {/* Filtrer */}

       <Box display="flex" sx={{mb:5}} alignItems="center" gap={1.5}>
            
                            {/* Label */}
                            <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                                <FilterListOutlined fontSize="small" />
                                <Typography variant="body1">Filtrer par :</Typography>
                            </Box>
            
                            {/* Tri par statut */}
                            <Select size="small" value={statut} onChange={(e) => setStatut(e.target.value)} displayEmpty>
                                <MenuItem value="">Tous les statuts</MenuItem>
                                <MenuItem value="disponible"> Disponible</MenuItem>
                                <MenuItem value="en_route"> En route</MenuItem>
                                <MenuItem value="en_panne"> En panne</MenuItem>
                            </Select>
                                {/* Recherche */}
                            <TextField
                            size="small"
                            placeholder="Rechercher un Véhicule..."
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
              onSelectAllClick={handleSelectAllClick}
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
                        checked={isItemSelected}
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
                      {row.immatriculation}
                    </TableCell>
                    {/* ,,,capacite,statut,dernierPosition */}
                    <TableCell align="right">{row.marque_modele}</TableCell>
                    <TableCell align="right">{row.capacite}</TableCell>
                    <TableCell align="right">{row.chauffeur_assigne}</TableCell>
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
                    <TableCell align="right">{row.dernierPosition}</TableCell>
                          {/* action */}
                    <TableCell align="right">
                      <IconButton onClick={() => { setSelectedVehicule(row); setOpenView(true); }} 
                        size="small" 
                        sx={{ color: "#6870fa" }}>
                      <VisibilityOutlined fontSize="small" />  {/* Voir */}
                    </IconButton>
                    <ViewVehiculeDialog
                      open={openView}
                      onClose={() => setOpenView(false)}
                      vehicule={selectedVehicule}
                    />
                    <IconButton size="small" sx={{ color: "#4cceac" }}>
                      <EditOutlined  onClick={() => { setSelectedVehicule(row); setOpenEdit(true); }}                        fontSize="small" />  {/* Modifier */}
                    </IconButton>
                    <EditVehiculeDialog
                      open={openEdit}
                      onClose={() => setOpenEdit(false)}
                      vehicule={selectedVehicule}
                       onRefresh={fetchCamions}  // AJOUTÉ
                    />
                    <IconButton 
                      size="small" 
                      sx={{ color: "#db4f4a" }}
                      onClick={() => handleDelete(row.id)}
                    >
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
        label="Dense padding"
      />
    </Box>
  );
}
