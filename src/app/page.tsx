"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ExpenseTable from "./components/ExpenseTable";
import DeleteDialog from "./components/DeleteDialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EntryDialog from "./components/EntryDialog";
import { supabase } from "../lib/supabase";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Paper, Grid, Card, CardContent } from "@mui/material";

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

export default function Home() {
  const [entryDialogOpen, setEntryDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<ExpenseEntry | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<ExpenseEntry | null>(null);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: "success" | "error" | "warning" | "info" }>({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  const [loading, setLoading] = React.useState(false);
  const [expenses, setExpenses] = React.useState<ExpenseEntry[]>([]);

  // Check if table exists and create if needed
  const checkAndCreateTable = async () => {
    try {
      // Try to insert a test record to see if table exists
      const { error } = await supabase
        .from('home_expenses')
        .insert([{
          date: '2024-01-01',
          description: 'Test Entry',
          price: 0,
          mother_income: 0,
          father_income: 0,
          shilpa_income: 0,
          gautam_income: 0,
          haresh_income: 0,
          other_income: 0
        }]);

      if (error && error.code === '42P01') {
        // Table doesn't exist, create it
        console.log('Table does not exist, creating...');
        const { error: createError } = await supabase.rpc('create_home_expenses_table');
        if (createError) {
          console.error('Error creating table:', createError);
          setSnackbar({ open: true, message: "Database table not found. Please create the table manually.", severity: "error" });
        }
      } else if (error) {
        console.error('Error checking table:', error);
      } else {
        // Table exists, delete the test record
        await supabase
          .from('home_expenses')
          .delete()
          .eq('description', 'Test Entry');
      }
    } catch (error) {
      console.error('Error checking table:', error);
    }
  };

  // Check table structure
  const checkTableStructure = async () => {
    try {
      console.log('Checking table structure...');
      const { data, error } = await supabase
        .from('home_expenses')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error checking table structure:', error);
        if (error.message.includes('column "date" does not exist')) {
          console.error('The table exists but has different column names');
          setSnackbar({ open: true, message: "Table structure is incorrect. Please run the SQL setup script.", severity: "error" });
        }
      } else {
        console.log('Table structure check successful');
        if (data && data.length > 0) {
          console.log('Sample row structure:', Object.keys(data[0]));
        }
      }
    } catch (error) {
      console.error('Error checking table structure:', error);
    }
  };

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      console.log('Fetching expenses from Supabase...');
      const { data, error } = await supabase
        .from('home_expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        if (error.code === '42P01') {
          // Table doesn't exist
          await checkAndCreateTable();
        }
        setSnackbar({ open: true, message: `Error fetching data: ${error.message}`, severity: "error" });
      } else {
        console.log('Fetched expenses:', data);
        setExpenses(data || []);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setSnackbar({ open: true, message: "Error fetching data", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Load expenses on component mount
  React.useEffect(() => {
    checkTableStructure();
    fetchExpenses();
  }, []);

  // For EntryForm (Add Data)
  const handleSaveEntry = async (data: any) => {
    setLoading(true);
    try {
      console.log('Saving entry:', data);
      
      if (editData) {
        // Update existing entry
        const { error } = await supabase
          .from('home_expenses')
          .update(data)
          .eq('id', editData.id);

        if (error) {
          console.error('Error updating entry:', error);
          throw error;
        }
        setSnackbar({ open: true, message: "Entry updated successfully!", severity: "success" });
      } else {
        // Add new entry
        const { error } = await supabase
          .from('home_expenses')
          .insert([data]);

        if (error) {
          console.error('Error inserting entry:', error);
          throw error;
        }
        setSnackbar({ open: true, message: "Entry added successfully!", severity: "success" });
      }
      
      await fetchExpenses(); // Refresh data
      setEditData(null);
      setEntryDialogOpen(false);
    } catch (error) {
      console.error('Error saving entry:', error);
      setSnackbar({ open: true, message: `Error saving entry: ${error}`, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // For Table actions
  const handleEditEntry = (data: ExpenseEntry) => {
    setEditData(data);
    setEntryDialogOpen(true);
  };

  const handleDeleteEntry = (data: ExpenseEntry) => {
    setDeleteItem(data);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    
    setLoading(true);
    try {
      console.log('Deleting entry:', deleteItem.id);
      const { error } = await supabase
        .from('home_expenses')
        .delete()
        .eq('id', deleteItem.id);

      if (error) {
        console.error('Error deleting entry:', error);
        throw error;
      }
      setSnackbar({ open: true, message: "Entry deleted successfully!", severity: "success" });
      await fetchExpenses(); // Refresh data
    } catch (error) {
      console.error('Error deleting entry:', error);
      setSnackbar({ open: true, message: `Error deleting entry: ${error}`, severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddNew = () => {
    setEditData(null);
    setEntryDialogOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AppBar position="static" sx={{ bgcolor: "#1e293b", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            🏠 Home Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Summary Cards - Above Table */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Total Expenses Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              bgcolor: "white"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#ef4444", fontWeight: 600, mb: 1 }}>
                  💰 Total Expenses
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  ₹{expenses.reduce((sum, exp) => sum + exp.price, 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Income Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              bgcolor: "white"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 600, mb: 1 }}>
                  💵 Total Income
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  ₹{expenses.reduce((sum, exp) => 
                    sum + exp.mother_income + exp.father_income + exp.shilpa_income + 
                    exp.gautam_income + exp.haresh_income + exp.other_income, 0
                  ).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Net Balance Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              bgcolor: "white"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 600, mb: 1 }}>
                  💳 Net Balance
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  ₹{(expenses.reduce((sum, exp) => 
                    sum + exp.mother_income + exp.father_income + exp.shilpa_income + 
                    exp.gautam_income + exp.haresh_income + exp.other_income, 0
                  ) - expenses.reduce((sum, exp) => sum + exp.price, 0)).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Entries Count Card */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              bgcolor: "white"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: "#8b5cf6", fontWeight: 600, mb: 1 }}>
                  📝 Total Entries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  {expenses.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Table */}
        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          bgcolor: "white"
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e293b" }}>
                📊 Expenses & Incomes
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{
                  bgcolor: "#3b82f6",
                  color: "white",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    bgcolor: "#2563eb",
                    boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.4)"
                  }
                }}
              >
                Add Entry
              </Button>
            </Box>
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: "#3b82f6" }} />
              </Box>
            )}
            
            {!loading && (
              <ExpenseTable 
                expenses={expenses}
                onEdit={handleEditEntry} 
                onDelete={handleDeleteEntry} 
              />
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Entry Dialog */}
      <EntryDialog
        open={entryDialogOpen}
        onClose={() => setEntryDialogOpen(false)}
        onSave={handleSaveEntry}
        editData={editData}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemDescription={deleteItem?.description}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
