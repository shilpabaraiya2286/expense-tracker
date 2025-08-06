"use client";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Typography, Divider, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface ExpenseEntry {
  id?: number;
  date: string;
  description: string;
  price: number | string;
  mother_income: number | string;
  father_income: number | string;
  shilpa_income: number | string;
  gautam_income: number | string;
  haresh_income: number | string;
  other_income: number | string;
}

interface FormData {
  date: string;
  description: string;
  price: string;
  mother_income: string;
  father_income: string;
  shilpa_income: string;
  gautam_income: string;
  haresh_income: string;
  other_income: string;
}

interface EntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ExpenseEntry) => void;
  editData?: ExpenseEntry;
}

export default function EntryDialog({ open, onClose, onSave, editData }: EntryDialogProps) {
  const [formData, setFormData] = React.useState<FormData>({
    date: "",
    description: "",
    price: "",
    mother_income: "",
    father_income: "",
    shilpa_income: "",
    gautam_income: "",
    haresh_income: "",
    other_income: "",
  });

  React.useEffect(() => {
    if (editData) {
      // Convert ExpenseEntry to FormData (convert numbers to strings)
      setFormData({
        date: editData.date,
        description: editData.description,
        price: String(editData.price),
        mother_income: String(editData.mother_income),
        father_income: String(editData.father_income),
        shilpa_income: String(editData.shilpa_income),
        gautam_income: String(editData.gautam_income),
        haresh_income: String(editData.haresh_income),
        other_income: String(editData.other_income),
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0], // Today's date as default
        description: "",
        price: "",
        mother_income: "",
        father_income: "",
        shilpa_income: "",
        gautam_income: "",
        haresh_income: "",
        other_income: "",
      });
    }
  }, [editData, open]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSave = () => {
    // Convert form data (strings) back to ExpenseEntry format (numbers)
    const data: ExpenseEntry = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      mother_income: parseFloat(formData.mother_income) || 0,
      father_income: parseFloat(formData.father_income) || 0,
      shilpa_income: parseFloat(formData.shilpa_income) || 0,
      gautam_income: parseFloat(formData.gautam_income) || 0,
      haresh_income: parseFloat(formData.haresh_income) || 0,
      other_income: parseFloat(formData.other_income) || 0,
    };
    onSave(data);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        bgcolor: "primary.main", 
        color: "white", 
        p: 3,
        position: "relative"
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
          {editData ? "✏️ Edit Entry" : "➕ Add New Entry"}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 4 }}>
          {/* Basic Information Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f8fafc", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
              📋 Basic Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
                  <TextField
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange("date")}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: "#64748b" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#3b82f6" },
                        "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 300px", minWidth: 0 }}>
                  <TextField
                    label="Description"
                    value={formData.description}
                    onChange={handleChange("description")}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: "#64748b" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#3b82f6" },
                        "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <TextField
                  label="Price/Expense Amount"
                  type="number"
                  value={formData.price}
                  onChange={handleChange("price")}
                  fullWidth
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: "#ef4444" }} />
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#ef4444" },
                      "&.Mui-focused fieldset": { borderColor: "#ef4444" }
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Income Section */}
          <Paper elevation={0} sx={{ p: 3, bgcolor: "#f0fdf4", borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: "#166534", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
              💰 Family Income
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
                  <TextField
                    label="Mother Income"
                    type="number"
                    value={formData.mother_income}
                    onChange={handleChange("mother_income")}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "#10b981" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#10b981" },
                        "&.Mui-focused fieldset": { borderColor: "#10b981" }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
                  <TextField
                    label="Father Income"
                    type="number"
                    value={formData.father_income}
                    onChange={handleChange("father_income")}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "#10b981" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#10b981" },
                        "&.Mui-focused fieldset": { borderColor: "#10b981" }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
                  <TextField
                    label="Shilpa Income"
                    type="number"
                    value={formData.shilpa_income}
                    onChange={handleChange("shilpa_income")}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "#10b981" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#10b981" },
                        "&.Mui-focused fieldset": { borderColor: "#10b981" }
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
                  <TextField
                    label="Gautam Income"
                    type="number"
                    value={formData.gautam_income}
                    onChange={handleChange("gautam_income")}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "#10b981" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#10b981" },
                        "&.Mui-focused fieldset": { borderColor: "#10b981" }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
                  <TextField
                    label="Haresh Income"
                    type="number"
                    value={formData.haresh_income}
                    onChange={handleChange("haresh_income")}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "#10b981" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#10b981" },
                        "&.Mui-focused fieldset": { borderColor: "#10b981" }
                      }
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 200px", minWidth: 0 }}>
                  <TextField
                    label="Other Income"
                    type="number"
                    value={formData.other_income}
                    onChange={handleChange("other_income")}
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: "#10b981" }} />
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": { borderColor: "#10b981" },
                        "&.Mui-focused fieldset": { borderColor: "#10b981" }
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#64748b",
            color: "#64748b",
            "&:hover": {
              borderColor: "#475569",
              bgcolor: "#f1f5f9"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
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
          {editData ? "Update Entry" : "Save Entry"}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 