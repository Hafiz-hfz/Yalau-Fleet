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
import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";
import * as XLSX from 'xlsx'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'

// filtre



import { FilterListOutlined } from "@mui/icons-material";
import {   Select, MenuItem, TextField , InputAdornment } from "@mui/material";
import { useState } from "react";
import { SearchOutlined } from "@mui/icons-material";
import Button from '@mui/material/Button';
import ViewLivraisonDialog from './ViewLivraisonDialog';//vue
import EditLivraisonDialog from './EditLivraisonDialog';//Edit
import DeleteLivraisonDialog from './DeleteLivraisonDialog';


function createData(id,date,num_livraison,camion,chauffeur,client,depart,destination,statut,position, camionId, chauffeurId,rawDate ) {
  return {
    id,
    date,
    num_livraison,
    camion,
    chauffeur,
    client,
    depart,
    destination,
    statut,
    position, // ← ajouté
     camionId, 
     chauffeurId,
     rawDate 
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
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'num_livraison',
    numeric: true,
    disablePadding: false,
    label: 'Num_livraison',
  },
  {
    id: 'camion',
    numeric: true,
    disablePadding: false,
    label: 'Camion',
  },
  {
    id: 'chauffeur',
    numeric: true,
    disablePadding: false,
    label: 'Chauffeur',
  },
  {
    id: 'client',
    numeric: true,
    disablePadding: false,
    label: 'Client'
  },
  {
    id: 'depart',
    numeric: true,
    disablePadding: false,
    label: 'Depart',
  },
   {
    id: 'destination',
    numeric: false,
    disablePadding: false,
    label: 'Destination',
  },

  
  {
    id: 'statut',
    numeric: true,
    disablePadding: false,
    label: 'Statut'
  },
   {
    id: 'position',
    numeric: true,
    disablePadding: false,
    label: 'Position '
  },

  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    label: 'Action'
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
         <AssignmentOutlined/>  Livraisons
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

export default function Tableau_Livraison({refreshKey}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
 const [rows, setRows] = useState([]);              // AJOUTÉ



 // AJOUTÉ
  const fetchLivraisons = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/livraisons`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(l => createData(
          l.id,
          new Date(l.date).toLocaleDateString('fr-FR'),
          l.numeroLivraison,
          l.camion ? l.camion.immatriculation : '—',
          l.chauffeur ? l.chauffeur.nom : '—',
          l.client ||  '—' ,  // AJOUTÉ
          l.villeDepart,
          l.villeDestination,
          l.statut, 
          "Bohicon", // position statique pour la démo
          l.camionId,      // AJOUTÉ
          l.chauffeurId ,   // AJOUTÉ
           l.date.split('T')[0]  // AJOUTÉ : format YYYY-MM-DD pour le champ date
        ))
        setRows(formatted)
      })
      .catch(err => console.error('Erreur:', err))
  }

  React.useEffect(() => {
    fetchLivraisons()
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

    
    // Tries
    
    const [statut, setStatut] = useState("");
    const [date, setDate] = useState("");
    const [search, setSearch] = useState("");
    
    const filteredRows = rows.filter((row) => {
  const matchSearch =
    (row.num_livraison || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.camion || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.chauffeur || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.client || "").toLowerCase().includes(search.toLowerCase()) // AJOUTÉ

const matchDate = date === "" || row.date === date.split("-").reverse().join("/");

  const matchStatut = statut === "" || row.statut.toLowerCase() === statut.toLowerCase();

  return matchSearch && matchStatut && matchDate;
}); 
//rien ne fais  attention
  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );


  //Couleur statut
  const getStatutStyle = (statut) => {
  switch (statut) {
    case "livree":
      return { bg: "#4cceac20", color: "#4cceac" };
    case "en_cours":
      return { bg: "#6870fa20", color: "#6870fa" };
    case "en_attente":
      return { bg: "#f0a50020", color: "#f0a500" };
    case "annule":
      return { bg: "#db4f4a20", color: "#db4f4a" };
    default:
      return { bg: "#66666620", color: "#666666" };
  }
};

// vue et affichage et delete
const [openEdit, setOpenEdit] = useState(false); // Edit
const [selectedLivraison, setSelectedLivraison] = useState(null);
const [openView, setOpenView] = useState(false); // View
const [openDelete, setOpenDelete] = useState(false); //Delete

// Fonction de suppression
const handleDelete = async (livraison) => {
  if (!window.confirm('Supprimer cette livraison ?')) return
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/livraisons/${livraison.id}`, {
      method: 'DELETE'
    })
    setRows(rows.filter(row => row.id !== livraison.id))
  } catch (error) {
    console.error('Erreur:', error)
  }
}

const handleExportClient = () => {
  const rows_export = filteredRows.map(row => ({
    'Date': row.date,
    'Numéro': row.num_livraison,
    'Camion': row.camion,
    'Chauffeur': row.chauffeur,
    'Client': row.client,
    'Départ': row.depart,
    'Destination': row.destination,
    'Statut': row.statut,
  }))
  const ws = XLSX.utils.json_to_sheet(rows_export)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Livraisons')
  XLSX.writeFile(wb, `livraisons_${search || 'tous'}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.xlsx`)
}
  return (
    <Box sx={{ width: '100%' , mt:7}}>
      {/* Filtre */}

      <Box display="flex" sx={{mb:5}} alignItems="center" gap={1.5}>
      
                      {/* Label */}
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                          <FilterListOutlined fontSize="small" />
                          <Typography variant="body1">Filtrer par :</Typography>
                      </Box>
      
                      {/* Tri par statut */}
                      <Select size="small" value={statut} onChange={(e) => setStatut(e.target.value)} displayEmpty>
                          <MenuItem value="">Tous les statuts</MenuItem>
                          <MenuItem value="en_attente">En attente</MenuItem>
                          <MenuItem value="en_cours">En cours</MenuItem>
                          <MenuItem value="livree">Livrée</MenuItem>
                          <MenuItem value="annule">Annulé</MenuItem>
                      </Select>
      
                      {/* Date */}
                      <TextField
                          type="date"
                          size="small"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                           sx={{
                            "& input[type='date']::-webkit-calendar-picker-indicator": {
                              filter: "invert(1)",  // transforme l'icône noire en blanche
                              cursor: "pointer",
                            }
                          }}
                      />
      
                          {/* Recherche */}
                      <TextField
                      size="small"
                      placeholder="Rechercher une livraison..."
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
              // numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
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
                      {row.date}
                    </TableCell>
                     
                    <TableCell align="right">{row.num_livraison}</TableCell>
                    <TableCell align="right">{row.camion}</TableCell>
                    <TableCell align="right">{row.chauffeur}</TableCell>
                    <TableCell align="right">{row.client}</TableCell>
                    <TableCell align="right">{row.depart}</TableCell>
                    <TableCell align="right">{row.destination}</TableCell>
                    {/* Statut */}
                    
                    <Box
                      sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 0.3,
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: getStatutStyle(row.statut).bg,
                      color: getStatutStyle(row.statut).color,
                      }}
                  >
                                               
                      {row.statut}
                    </Box>
                    <TableCell align="right">{row.position}</TableCell>

                    {/* Action */}
                    <TableCell align="right">
                    <IconButton  onClick={() => { setSelectedLivraison(row); setOpenView(true); }}
                     size="small" sx={{ color: "#fff" }}>
                      <VisibilityOutlined fontSize="small" />
                    </IconButton>
                    <ViewLivraisonDialog 
                    open={openView}
                    onClose={() => setOpenView(false)}
                    livraison={selectedLivraison}
                  />
                    <IconButton onClick={() => { setSelectedLivraison(row); setOpenEdit(true); }}
                      size="small" sx={{ color: "#fff" }}>
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <EditLivraisonDialog
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    livraison={selectedLivraison}
                     onRefresh={fetchLivraisons}  // AJOUTÉ
                  />
                    <IconButton onClick={() => handleDelete(row)}  size="small" sx={{ color: "#db4f4a" }}>
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                    <DeleteLivraisonDialog
                      open={openDelete}
                      onClose={() => setOpenDelete(false)}
                      livraison={selectedLivraison}
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
          count={filteredRows.length}
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
      <Box sx={{ display: 'flex', mt: 3, justifyContent: "space-between" }}>
            
        <Button
                        variant="outlined"
                        startIcon={<DownloadOutlinedIcon />}
                        onClick={handleExportClient}
                        size="small"
                      >
                        Exporter la liste (CSV)
                      </Button>
       </Box>
    </Box>

    
  );
}
