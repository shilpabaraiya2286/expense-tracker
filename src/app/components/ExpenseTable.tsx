"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography, Box, MenuItem, Select, FormControl, InputLabel, Button, TextField, Stack } from "@mui/material";
import dayjs from "dayjs";

interface ExpenseEntry {
  id: number;
  date: string;
  description: string;
  price: number;
  mother_income: number;
  father_income: number;
  shilpa_income: number;
  gautam_income: number;
  haresh_income: number;
  other_income: number;
  created_at: string;
  updated_at: string;
}

// Helper to get unique months from data
const getUniqueMonths = (rows: ExpenseEntry[]) => {
  const months = rows.map((row) => dayjs(row.date).format("YYYY-MM"));
  return Array.from(new Set(months));
};

// Calculate total price per day
const getTotalPricePerDay = (date: string, rows: ExpenseEntry[]) => {
  return rows
    .filter((row) => row.date === date)
    .reduce((sum, row) => sum + row.price, 0);
};

const columns = [
  { id: "date", label: "Date" },
  { id: "description", label: "Description" },
  { id: "price", label: "Price" },
  { id: "totalPricePerDay", label: "Total Price per Day" },
  { id: "mother_income", label: "Mother Income" },
  { id: "father_income", label: "Father Income" },
  { id: "shilpa_income", label: "Shilpa Income" },
  { id: "gautam_income", label: "Gautam Income" },
  { id: "haresh_income", label: "Haresh Income" },
  { id: "other_income", label: "Other Income" },
  { id: "actions", label: "Actions" },
];

interface ExpenseTableProps {
  expenses: ExpenseEntry[];
  onEdit: (row: ExpenseEntry) => void;
  onDelete: (row: ExpenseEntry) => void;
}

export default function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const [month, setMonth] = React.useState<string>("");
  const [date, setDate] = React.useState<string>("");

  // Filtering logic
  let filteredRows = expenses;
  if (month) {
    filteredRows = filteredRows.filter((row) => dayjs(row.date).format("YYYY-MM") === month);
  }
  if (date) {
    filteredRows = filteredRows.filter((row) => row.date === date);
  }

  // For month dropdown
  const uniqueMonths = getUniqueMonths(expenses);

  return (
    <Box>
      {/* Filter Bar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={2}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel id="month-filter-label">Month</InputLabel>
          <Select
            labelId="month-filter-label"
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
          >
            <MenuItem value="">All Months</MenuItem>
            {uniqueMonths.map((m) => (
              <MenuItem key={m} value={m}>
                {dayjs(m + "-01").format("MMMM YYYY")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          size="small"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setMonth("");
            setDate("");
          }}
        >
          Clear Filters
        </Button>
      </Stack>
      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.id === "actions" ? "center" : "left"}
                  sx={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, idx) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: idx % 2 === 0 ? "#f0f4ff" : "#fff",
                  "&:hover": { bgcolor: "#e3f2fd" },
                  transition: "background 0.2s",
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell sx={{ color: "#1976d2", fontWeight: 600 }}>{row.price}</TableCell>
                <TableCell sx={{ color: "#388e3c", fontWeight: 600 }}>{getTotalPricePerDay(row.date, filteredRows)}</TableCell>
                <TableCell>{row.mother_income}</TableCell>
                <TableCell>{row.father_income}</TableCell>
                <TableCell>{row.shilpa_income}</TableCell>
                <TableCell>{row.gautam_income}</TableCell>
                <TableCell>{row.haresh_income}</TableCell>
                <TableCell>{row.other_income}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="info" sx={{ mr: 1, bgcolor: "#e3f2fd", ":hover": { bgcolor: "#bbdefb" } }} onClick={() => onEdit(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" sx={{ bgcolor: "#ffebee", ":hover": { bgcolor: "#ffcdd2" } }} onClick={() => onDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ color: "grey.600", py: 4 }}>
                  No data found for selected filter(s).
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}